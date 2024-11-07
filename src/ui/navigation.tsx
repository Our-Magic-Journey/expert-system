type Props = {
  items?: ([string, string] | [string, () => void])[];
}

export const Navigation = ({ items = [] }: Props) => (
  <div className="flex justify-between w-full">  
    {items.map(item => {
      if (typeof item[1] === 'string') {
        const [url, name] = item;

        return (
          <a 
            key={`${name}-${url}`}
            className="bold text-yellow-400 hover:text-yellow-200 select-none" 
            href={url}
          >{name}</a>
        );
      }
      else {
        const [name, callback] = item;

        return (
          <div
            key={name}
            className="bold text-yellow-400 hover:text-yellow-200 cursor-pointer select-none"
            onClick={callback}
          >{name}</div>
        )
      }
    })
  }
  </div>
)