import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <div className="flex flex-col space-y-5 pb-10  divide-y">
          <ProductList kind="purchases" />
        </div>
      </div>
    </Layout>
  );
};

export default Bought;
