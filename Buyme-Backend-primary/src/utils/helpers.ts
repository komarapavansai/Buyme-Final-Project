const Hashids = require('hashids/cjs');
import jwt from 'jsonwebtoken';
import { Service, Inject } from 'typedi';
import config from '../config';

@Service()
export default class HelperService {

  private hashids: any;
  private hashIdsObj: any;

  constructor(@Inject('logger') private logger) {
    this.hashids = {
      salt: 'this is my salt',
      minHashLength: 10,
      alphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    };

    this.hashIdsObj = new Hashids(this.hashids.salt, this.hashids.minHashLength, this.hashids.alphabet);
  }

  public generateJwtForPayload(payload: object): string {
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '9999999s' });
    return token;
  }

  public static generateUpdateQuery(tableName: string, propertyList: string[], dto: any) {
    const updates: string[] = [];
    const values: any[] = [];

    propertyList.forEach((prop) => {
      if (dto[prop] !== undefined && dto[prop] !== null) {
        updates.push(`${prop} = ?`);
        values.push(dto[prop]);
      }
    });

    if (updates.length === 0) {
      throw new Error('No valid fields to update.');
    }

    const query = `UPDATE ${tableName} SET ${updates.join(', ')} WHERE id = ?`;
    values.push(dto.id); // Assuming user_id is mandatory

    return { query, values };
  };

  public validatedEncodedPassword(pwd: string) {
    if (pwd.trim().length < 6) throw new Error('Password length must be atleast 6 characters long!');
    const encoded = HelperService.base64EncodeString(pwd);
    return encoded;
  }

  public static base64EncodeString(inputString: string): string {
    const binaryData = Buffer.from(inputString, 'utf-8');
    const base64String = binaryData.toString('base64');
    return base64String;
  }

  public static base64DecodeString(base64String: string): string {
    const binaryData = Buffer.from(base64String, 'base64');
    const decodedString = binaryData.toString('utf-8');
    return decodedString;
  }

  public static validateDateRange(startDate: number, endDate: number): void {
    // Calculate the difference in time (milliseconds)
    const differenceInTime = endDate - startDate;

    // Convert the difference from milliseconds to days
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 2) {
      throw new Error('The difference between start date and end date must be at least 2 days.');
    }
  }

  public static validatePayload(reqBody: any): void {
    for (const key in reqBody) {
      if (Object.prototype.hasOwnProperty.call(reqBody, key)) {
        const element = reqBody[key];
        if (element == undefined) {
          console.debug("Null values found with:", key, element);
          throw new Error(`Null values found with:${key}, ${element}`);
        }
      }
    }
  }

  isNumber = function isNumber(a) {
    const value = Number(a);
    return typeof value === 'number' && isFinite(value);
  };

  public formatFileName(fileName: string) {
    //remove special chars
    if (!fileName) {
      return fileName;
    }
    let str: string = null;
    str = fileName.replace(/\s+/g, '');
    str = str.replace(/[^0-9a-zA-Z._/+/-/*/://]/ig, "-");

    return str;
  }

  public formatFolderName(firstName: string, lastName: string, contactGuId: string) {
    const contactInfo: string = `${this.capitalizeFirstLetter(firstName.trim())}-${this.capitalizeFirstLetter(lastName.trim())}-${contactGuId}`
    return contactInfo;
  }

  public formatOwnerName(firstName: string, lastName: string) {
    const ownerName: string = `${this.capitalizeFirstLetter(firstName.trim())} ${this.capitalizeFirstLetter(lastName.trim())}`
    return ownerName;
  }

  public capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  public static getHeaders(): any {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
    };
  }

  public static getTokenHeader() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${config.progressToken}`
      },
    };
  }

  public static verifyCustomerReprRole(is_condition_met: boolean) {
    if (!is_condition_met) {
      throw new Error("User should be a Customer Representative to complete this action!");
    }
  }

  public static verifyAdminRole(is_condition_met: boolean) {
    if (!is_condition_met) {
      throw new Error("User should be an admin to complete this action!");
    }
  }
  
  public getTokenFromHeader(req: any) {
    /**
     * @TODO Edge and Internet Explorer do some weird things with the headers
     * So I believe that this should handle more 'edge' cases ;)
     */
    if (
      (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }


  public decodeHash(guId: any): any {
    if (guId != undefined && guId != "") {
      if (isNaN(guId)) {
        return guId ? this.hashIdsObj.decode(guId)[0] : '';
      } else {
        return guId;
      }
    } else {
      return guId;
    }
  }

  public encodeHash(guId: any): any {
    if (guId != undefined && guId != "") {
      return this.isNumber(guId) ? this.hashIdsObj.encode(guId) : guId;
    } else {
      return "";
    }
  }

}
