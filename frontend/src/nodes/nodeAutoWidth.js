// nodeAutoWidth.js

export const measureFormControlScrollWidth = (element) => {
  if (!element) return 200;
  
  let estimatedWidth = 200;
  if (element.value) {
    // approx pixels per char, tuned to be more conservative
    const charWidth = 7.2; 
    // padding and icon space
    const extraPadding = 40; 
    estimatedWidth = element.value.length * charWidth + extraPadding;
  }
  
  // Use scrollWidth for textareas, or estimatedWidth for inputs
  // We add 20px buffer for the node's internal padding
  return Math.max(200, element.scrollWidth + 20, estimatedWidth);
};
