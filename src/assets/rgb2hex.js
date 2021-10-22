const rgb2hex = (rgb) => 
    rgb !== "none" 
    ? `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
         .slice(1)
         .map(n => parseInt(n, 10).toString(16).padStart(2, '0'))
         .join('')}`
    : "none"

export default rgb2hex