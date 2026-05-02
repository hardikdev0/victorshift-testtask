import json
from collections import defaultdict, deque

from fastapi import FastAPI, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def _pipeline_is_dag(node_ids: set, edges: list) -> bool:
    """Kahn topological sort: DAG iff every node in the subgraph is processed."""
    adj = defaultdict(list)
    indeg = {v: 0 for v in node_ids}

    for e in edges:
        s, t = e.get('source'), e.get('target')
        if s not in node_ids or t not in node_ids:
            continue
        if s == t:
            return False
        adj[s].append(t)
        indeg[t] += 1

    q = deque([v for v in node_ids if indeg[v] == 0])
    seen = 0
    while q:
        v = q.popleft()
        seen += 1
        for w in adj[v]:
            indeg[w] -= 1
            if indeg[w] == 0:
                q.append(w)

    return seen == len(node_ids)


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: str = Form(...)):
    try:
        payload = json.loads(pipeline)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail='Invalid JSON in pipeline field') from exc

    nodes = payload.get('nodes') or []
    edges = payload.get('edges') or []

    if not isinstance(nodes, list) or not isinstance(edges, list):
        raise HTTPException(status_code=400, detail='nodes and edges must be arrays')

    num_nodes = len(nodes)
    num_edges = len(edges)

    try:
        node_ids = {n['id'] for n in nodes if isinstance(n, dict) and 'id' in n}
    except TypeError as exc:
        raise HTTPException(status_code=400, detail='Each node must be an object with an id') from exc

    if len(node_ids) != num_nodes:
        raise HTTPException(status_code=400, detail='Duplicate or missing node ids')

    is_dag = _pipeline_is_dag(node_ids, edges)

    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': is_dag}
