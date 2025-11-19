import { Injectable } from '@angular/core';
import axios from 'axios';
import { ApiResponse } from '../interfaces/apires';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  SERVER = environment.serverUrl;

  constructor() { }

  async registration(table: string, data: any) {
    try {
      const response = await axios.post(`${this.SERVER}/${table}/registration`, data);
      return {
        status: 200,
        message: "Sikeres regisztráció! Most már bejelentkezhet.",
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: error.response.data.error
      }
    }
  }

  async login(table: string, data: any) {
    try {
      const response = await axios.post(`${this.SERVER}/${table}/login`, data);
      return {
        status: 200,
        message: "Sikeres bejelentkezés!",
        data: response.data
      }
    }
    catch (error: any) {
      return {
        status: 500,
        message: error.response.data.error
      }
    }
  }

  async sendmail(data: object) : Promise<ApiResponse> {
    try{
      const response = await axios.post(`${this.SERVER}/sendmail`, data);
      return {
        status: 200,
        message: response.data.message
      }
    } catch (error: any){
      return {
        status: 500,
        message: error.response.data.error
      };
    }
  }

  async upload(formdata: FormData): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${this.SERVER}/upload`, formdata);
      return {
        status: 200,
        data: response.data
      }

    } catch (error: any) {
      return {
        status: 500,
        message: 'Hiba történt a fájl feltöltésekor!'
      };

    }
  }

  async deleteImage(filename : string) : Promise<ApiResponse>{
    try {
      const response = await axios.delete(`${this.SERVER}/image/${filename}`);
      return {
        status: 200,
        data: response.data
      }

    } catch (error: any) {
      return {
        status: 500,
        message: 'Hiba történt a fájl törlésekor!'
      };

    }
  }

  async selectAll(table: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${this.SERVER}/${table}`);
      return {
        status: 200,
        data: response.data
      };

    }
    catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt az adatok elérésekor!'
      };
    }

  }

  async select(table: string, id: number): Promise<ApiResponse> {

    try {
      const response = await axios.get(`${this.SERVER}/${table}/${id}`);
      return {
        status: 200,
        data: response.data
      };

    }
    catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt az adatok elérésekor!'
      };
    }

  }

  async selectWhere(table: string, column: string, op: string, value: any): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${this.SERVER}/${table}/${column}/${op}/${value}`);
      return {
        status: 200,
        data: response.data
      };
    }
    catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt az adatok elérésekor!'
      };
    }
  }

  async insert(table: string, data: any) {
    try {
      const response = await axios.post(`${this.SERVER}/${table}`, data);
      return {
        status: 200,
        message: "Rekord hozzáadva!",
        data: response.data  //nem kötelező visszaadni
      };

    }
    catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt a művelet során!'
      };
    }
  }

  async update(table: string, id: number, data: any) {
    try {
      const response = await axios.patch(`${this.SERVER}/${table}/${id}`, data);
      return {
        status: 200,
        message: "Rekord módosítva!",
        data: response.data  //nem kötelező visszaadni
      };

    }
    catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt a művelet során!'
      };
    }

  }

  async delete(table: string, id: number) {

    try {
      const response = await axios.delete(`${this.SERVER}/${table}/${id}`);
      return {
        status: 200,
        message: "Rekord törölve!"
      };

    }
    catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt az adatok elérésekor!'
      };
    }


  }

  async deleteAll(table: string) {
    try {
      const response = await axios.delete(`${this.SERVER}/${table}`);
      return {
        status: 200,
        message: "Összes rekord törölve a táblából!"
      };

    } catch (error: any) {
      console.log(error.message);
      return {
        status: 500,
        message: 'Hiba történt az adatok elérésekor!'
      };
    }
  }
}
