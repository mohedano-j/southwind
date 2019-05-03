import React from "react";
import ProductForm from "./ProductForm";
import Spinner from "../common/Spinner/Spinner";
import { toast } from "react-toastify";
import { CategoryService } from "../../services/categoryService";
import { ProductService } from "../../services/productService";
import { Product } from "../../product";
import { Category } from "../../category";

type propsType = {
  match: any;
  history: any;
};

type stateType = {
  categoryService: CategoryService;
  productService: ProductService;
  loading: boolean;
  product: Product;
  products: Product[];
  categories: Category[];
  errors: any;
};

const emptyProduct: Product = {
  productId: 0,
  productName: "",
  categoryId: 0,
  unitPrice: 0,
  unitsInStock: 0
};

class ManageProductPage extends React.Component<propsType, stateType> {
  constructor(props: propsType) {
    super(props);
    this.state = {
      productService: new ProductService(),
      categoryService: new CategoryService(),
      products: [],
      categories: [],
      loading: false,
      product: emptyProduct,
      errors: {}
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.formIsValid = this.formIsValid.bind(this);
  }

  componentWillMount() {
    const { match } = this.props;
    const { categoryService, productService } = this.state;
    this.setState({ loading: true });
    categoryService.getAll().subscribe((categories: Category[]) => {
      this.setState({ categories: categories, loading: false });
    });
    productService.getAll().subscribe((products: Product[]) => {
      this.setState({ products: products, loading: false });
      if (match.params.id) {
        const productId = parseInt(match.params.id);
        const product = products.find(
          (p: Product) => p.productId === productId
        );
        if (product) this.setState({ product: product });
      }
    });
  }

  handleChange(event: any) {
    const { name, value } = event.target;
    const { product } = this.state;
    const newProduct = { ...product, [name]: value };

    this.setState({ product: newProduct });
  }

  handleCancel() {
    const { history } = this.props;
    history.push("/products");
  }

  handleSave(event: any) {
    event.preventDefault();

    if (!this.formIsValid()) return;

    const { history } = this.props;
    const { productService, product } = this.state;

    if (product === undefined) {
      return new Error("Product is undefined");
    }

    if (product.productId === 0) {
      productService.add(product).subscribe((product: Product) => {
        history.push("/products");
        toast.success("Product added");
      });
    } else {
      productService.edit(product).subscribe((product: Product) => {
        history.push("/products");
        toast.success("Product edited");
      });
    }
  }

  isPositiveInteger(s: any) {
    return /^\+?[1-9][\d]*$/.test(s);
  }

  isPositiveFloat(s: any) {
    return !isNaN(s) && Number(s) > 0;
  }

  formIsValid() {
    const { categories, product } = this.state;

    if (categories == undefined) {
      return new Error("Categories is undefined");
    }

    if (product === undefined) {
      return new Error("Product is undefined");
    }

    const { productName, categoryId, unitPrice, unitsInStock } = product;
    const errors: any = {};

    if (!productName) errors.productName = "Product Name is required.";
    if (!unitPrice) errors.unitPrice = "Unit Price is required";
    if (!categoryId) errors.categoryId = "Category is required";
    if (!unitsInStock) errors.unitsInStock = "Units in Stocks is required";

    if (!errors.unitPrice && !this.isPositiveFloat(unitPrice)) {
      errors.unitPrice = "Unit Price must be a positive number";
    }

    if (!errors.unitsInStock && !this.isPositiveInteger(unitsInStock)) {
      errors.unitsInStock = "Units in Stocks must be a positive integer";
    }

    if (
      !errors.categoryId &&
      !categories.find(category => category.categoryId == categoryId)
    ) {
      errors.categoryId = "Please select a valid";
    }

    this.setState({ errors: errors });

    return Object.keys(errors).length === 0;
  }

  render() {
    const { loading, categories, product, errors } = this.state;

    return loading === true || product === undefined ? (
      <Spinner />
    ) : (
      <ProductForm
        product={product}
        errors={errors}
        categories={categories}
        onChange={this.handleChange}
        onSave={this.handleSave}
        onCancel={this.handleCancel}
        loading={loading}
      />
    );
  }
}

export default ManageProductPage;
