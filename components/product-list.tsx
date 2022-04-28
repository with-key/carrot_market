import { Product, Sale } from "@prisma/client";
import useSWR from "swr";
import Item from "./item";

type ProductListProps = {
  kind: "favs" | "sales" | "purchases";
};

interface SaleWithProduct extends Sale {
  product: Product & { _count: { favs: number } };
}

type ProductListReponse = {
  [key: string]: SaleWithProduct[];
};

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListReponse>(`/api/users/me/${kind}`);

  if (!data) return null;
  return (
    <>
      {data[kind].map((record) => (
        <Item
          id={record.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.favs}
        />
      ))}
    </>
  );
}
