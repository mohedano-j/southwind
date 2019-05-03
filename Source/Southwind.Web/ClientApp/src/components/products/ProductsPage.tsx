import React from "react";
import ProductList from "./ProductList";
import { Redirect } from "react-router-dom";
import Spinner from "../common/Spinner/Spinner";
import { toast } from "react-toastify";
import { CategoryService } from "../../services/categoryService";
import { ProductService } from "../../services/productService";
import { Category } from "../../entities/category";
import { Product } from "../../entities/product";
import { orderBy } from "lodash";

type propsType = {};

type stateType = {
  categoryService: CategoryService;
  productService: ProductService;
  loading: boolean;
  categories: Category[];
  products: Product[];
  clickedProduct: any;
  nextOrderAsc: string;
  modalIsOpen: boolean;
  fieldOrder: string;
  redirectToAddProductPage: boolean;
};

class ProductsPage extends React.Component<propsType, stateType> {
  constructor(props: propsType) {
    super(props);
    this.state = {
      categoryService: new CategoryService(),
      productService: new ProductService(),
      products: [],
      categories: [],
      loading: false,
      clickedProduct: {},
      nextOrderAsc: "asc",
      modalIsOpen: false,
      fieldOrder: "",
      redirectToAddProductPage: false
    };
  }

  componentDidMount() {
    const { categoryService, productService } = this.state;
    this.setState({ loading: true });
    categoryService.getAll().subscribe((categories: Category[]) => {
      this.setState({ categories: categories, loading: false });
    });
    this.setState({ loading: true });
    productService.getAll().subscribe((products: Product[]) => {
      this.setState({ products: products, loading: false });
    });
  }

  sortProducts(field: string, asc: boolean) {
    const { products } = this.state;
    const sortedProducts = orderBy(products, field, asc);
    this.setState({ products: sortedProducts });
  }

  handleRequestSort = (clickedHeader: string) => {
    const { fieldOrder, nextOrderAsc } = this.state;
    const asc = nextOrderAsc === "asc";

    this.sortProducts(clickedHeader, asc);

    if (fieldOrder === clickedHeader) {
      this.setState({
        nextOrderAsc: this.state.nextOrderAsc == "asc" ? "desc" : "asc"
      });
    } else {
      this.setState({ nextOrderAsc: "desc" });
      this.setState({ fieldOrder: clickedHeader });
    }
  };

  handleModalCancel = () => {
    this.setState({ modalIsOpen: false });
    this.setState({ clickedProduct: {} });
  };

  handleDeleteSelected = (productSelected: any) => {
    this.setState({ modalIsOpen: true });
    this.setState({ clickedProduct: productSelected });
  };

  handleDeleteProduct = () => {
    this.setState({ modalIsOpen: false });

    const { clickedProduct, productService } = this.state;

    productService.delete(clickedProduct).subscribe((product: Product) => {
      const { products } = this.state;

      if (products === undefined) {
        return new Error("Products is undefined");
      }

      const newProducts = products.filter(
        (p: Product) => p.productId !== product.productId
      );
      this.setState({ products: newProducts });
      toast.success("Product deleted");
    });
  };

  render() {
    const { loading, products } = this.state;

    return (
      <>
        {this.state.redirectToAddProductPage && <Redirect to="/product" />}
        <h2>Products {products.length}</h2>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-product"
              onClick={() => this.setState({ redirectToAddProductPage: true })}
            >
              Add Product
            </button>
            <ProductList
              products={products}
              onRequestSort={this.handleRequestSort}
              onDeleteClick={this.handleDeleteSelected}
              onDeleteConfirm={this.handleDeleteProduct}
              onModalCancel={this.handleModalCancel}
              modalIsOpen={this.state.modalIsOpen}
            />
          </>
        )}
      </>
    );
  }
}

export default ProductsPage;
