type Props = {
  items: [string, string][];
}

export const Navigation = ({ items = [] }: Props) => (
  <div className="flex justify-between w-full">  
    {items.map(([url, name]) => (
      <a 
        key={`${name}-${url}`}
        className="bold text-yellow-400 hover:text-yellow-200" 
        href={url}
      >{name}</a>
    ))}
  </div>
)