export function CalculateReadTime ({content}) {
  const arrayOfWords = content.trim().split(/\s+/).filter(word => word.length > 0)
  const readTime = Math.ceil(arrayOfWords.length/250)
  return <span>{readTime} min read</span>
};


