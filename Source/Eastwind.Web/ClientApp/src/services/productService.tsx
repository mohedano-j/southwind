import axios from "axios";
import { Observable } from "rxjs";
import { Product } from "../product";
const baseUrl = process.env.API_URL + "/products/";

export class ProductService {
  getOne(productId: number): Observable<Product> {
    const observable$ = Observable.create((observer: any) => {
      axios
        .get(baseUrl + productId)
        .then((response: any) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
    return observable$;
  }

  getAll(): Observable<Product[]> {
    const observable$ = Observable.create((observer: any) => {
      axios
        .get(baseUrl)
        .then((response: any) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
    return observable$;
  }

  add(product: Product): Observable<Product> {
    const observable$ = Observable.create((observer: any) => {
      axios
        .post(baseUrl, product)
        .then((response: any) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
    return observable$;
  }

  edit(product: Product) {
    const observable$ = Observable.create((observer: any) => {
      axios
        .put(baseUrl, product)
        .then((response: any) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
    return observable$;
  }

  delete(product: Product): Observable<Product> {
    const observable$ = Observable.create((observer: any) => {
      axios
        .delete(baseUrl + product.productId)
        .then((response: any) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error: any) => {
          observer.error(error);
        });
    });
    return observable$;
  }
}

export default new ProductService();
