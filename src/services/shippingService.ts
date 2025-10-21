export interface ShippingMethod {
  id: string;
  name: string;
  carrier: ShippingCarrier;
  type: ShippingType;
  estimatedDays: number;
  cost: number;
  description: string;
  isInsured: boolean;
  maxWeight: number;
  restrictions?: string[];
}

export interface ShippingRate {
  id: string;
  carrier: ShippingCarrier;
  service: string;
  cost: number;
  estimatedDays: number;
  deliveryDate: string;
  isInsured: boolean;
  insuranceCost?: number;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: ShippingCarrier;
  service: string;
  status: ShipmentStatus;
  fromAddress: Address;
  toAddress: Address;
  weight: number;
  dimensions: Dimensions;
  cost: number;
  insuranceValue?: number;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery: string;
  trackingEvents: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  status: ShipmentStatus;
  message: string;
  location: string;
  timestamp: string;
  details?: string;
}

export interface Address {
  name: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
  isResidential?: boolean;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'in' | 'cm';
}

export interface DeliveryEstimate {
  carrier: ShippingCarrier;
  service: string;
  estimatedDays: number;
  earliestDate: string;
  latestDate: string;
  businessDaysOnly: boolean;
}

export interface InsuranceOption {
  value: number;
  cost: number;
  coverage: string;
  terms: string;
}

export enum ShippingCarrier {
  FEDEX = 'fedex',
  UPS = 'ups',
  USPS = 'usps',
  DHL = 'dhl',
  AMAZON = 'amazon',
  LOCAL = 'local'
}

export enum ShippingType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
  TWO_DAY = 'two_day',
  GROUND = 'ground',
  INTERNATIONAL = 'international'
}

export enum ShipmentStatus {
  CREATED = 'created',
  LABEL_PRINTED = 'label_printed',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  EXCEPTION = 'exception',
  RETURNED = 'returned',
  CANCELED = 'canceled'
}

export interface AddressValidation {
  isValid: boolean;
  originalAddress: Address;
  suggestedAddress?: Address;
  errors: string[];
  warnings: string[];
}

export interface ShippingLabel {
  id: string;
  shipmentId: string;
  format: 'PDF' | 'PNG' | 'ZPL';
  url: string;
  trackingNumber: string;
  cost: number;
}

class ShippingService {
  private baseUrl = process.env.REACT_APP_SHIPPING_SERVICE_URL || 'http://localhost:8085';

  async getShippingMethods(data: {
    fromZip: string;
    toZip: string;
    weight: number;
    dimensions: Dimensions;
    value?: number;
  }): Promise<ShippingMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/shipping-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipping methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
      throw error;
    }
  }

  async getRates(data: {
    fromAddress: Address;
    toAddress: Address;
    packages: Array<{
      weight: number;
      dimensions: Dimensions;
      value?: number;
    }>;
    carriers?: ShippingCarrier[];
  }): Promise<ShippingRate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/rates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipping rates');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch shipping rates:', error);
      throw error;
    }
  }

  async createShipment(data: {
    orderId: string;
    fromAddress: Address;
    toAddress: Address;
    packages: Array<{
      weight: number;
      dimensions: Dimensions;
      value?: number;
      items: string[];
    }>;
    carrier: ShippingCarrier;
    service: string;
    insuranceValue?: number;
    signatureRequired?: boolean;
    deliveryInstructions?: string;
  }): Promise<Shipment> {
    try {
      const response = await fetch(`${this.baseUrl}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create shipment');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create shipment:', error);
      throw error;
    }
  }

  async getShipment(shipmentId: string): Promise<Shipment> {
    try {
      const response = await fetch(`${this.baseUrl}/shipments/${shipmentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch shipment');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch shipment:', error);
      throw error;
    }
  }

  async trackShipment(trackingNumber: string, carrier?: ShippingCarrier): Promise<TrackingEvent[]> {
    try {
      const url = carrier 
        ? `${this.baseUrl}/tracking/${trackingNumber}?carrier=${carrier}`
        : `${this.baseUrl}/tracking/${trackingNumber}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to track shipment');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to track shipment:', error);
      throw error;
    }
  }

  async getDeliveryEstimate(data: {
    fromZip: string;
    toZip: string;
    carrier: ShippingCarrier;
    service: string;
    shipDate?: string;
  }): Promise<DeliveryEstimate> {
    try {
      const response = await fetch(`${this.baseUrl}/delivery-estimate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to get delivery estimate');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get delivery estimate:', error);
      throw error;
    }
  }

  async validateAddress(address: Address): Promise<AddressValidation> {
    try {
      const response = await fetch(`${this.baseUrl}/address/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(address)
      });

      if (!response.ok) {
        throw new Error('Failed to validate address');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to validate address:', error);
      throw error;
    }
  }

  async generateLabel(shipmentId: string, format: 'PDF' | 'PNG' | 'ZPL' = 'PDF'): Promise<ShippingLabel> {
    try {
      const response = await fetch(`${this.baseUrl}/shipments/${shipmentId}/label`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ format })
      });

      if (!response.ok) {
        throw new Error('Failed to generate shipping label');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to generate shipping label:', error);
      throw error;
    }
  }

  async cancelShipment(shipmentId: string): Promise<{ success: boolean; refundAmount?: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/shipments/${shipmentId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel shipment');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to cancel shipment:', error);
      throw error;
    }
  }

  async getInsuranceOptions(value: number): Promise<InsuranceOption[]> {
    try {
      const response = await fetch(`${this.baseUrl}/insurance/options?value=${value}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insurance options');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch insurance options:', error);
      throw error;
    }
  }

  async schedulePickup(data: {
    shipmentIds: string[];
    pickupDate: string;
    readyTime: string;
    closeTime: string;
    location: 'front_door' | 'back_door' | 'side_door' | 'knock_on_door' | 'ring_bell' | 'mail_room' | 'office' | 'reception';
    instructions?: string;
  }): Promise<{ pickupId: string; confirmationNumber: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/pickup/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to schedule pickup');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
      throw error;
    }
  }

  async getCarrierServices(carrier: ShippingCarrier): Promise<Array<{
    code: string;
    name: string;
    description: string;
    type: ShippingType;
    maxWeight: number;
    features: string[];
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/carriers/${carrier}/services`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch carrier services');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch carrier services:', error);
      throw error;
    }
  }
}

export const shippingService = new ShippingService();
