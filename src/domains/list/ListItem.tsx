type Props = {
  name: string;
  category: string;
  image?: string;
};

export function ListItem(props: Props) {
  const { name, category, image } = props;
  return (
    <div>
      {name}
      {category}
      {image}
    </div>
  );
}
