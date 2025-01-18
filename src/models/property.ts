import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  name: string;
  priceRange: { bhk: string; price: number }[];
  location: { address: string; googleMapLink?: string, locality?: string };
  images: string[];
  landParcel: number;
  towers: number;
  configurations: { bhk: string; carpetArea: number }[];
  reraNumbers: string[];
  possession: { target: string; reraPossession?: string };
  about: string;
  prosAndCons: { pros: string[]; cons: string[] };
  videoLink?: string;
  internalAmenities: string[];
  externalAmenities: string[];
  masterPlanImage?: string;
  floorPlanImage?: string;
  pricingDetails: {
    carpetArea: number;
    totalPrice: number;
    downPayment: number;
    parking: number;
    unitPlanImage: string;
  }[];
  paymentScheme?: string;
  offer?: string;
  faqs: { question: string; answer: string }[];
}

const propertySchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  priceRange: [
    { bhk: { type: String, required: true }, price: { type: Number, required: true } }
  ],
  location: {
    address: { type: String, required: true },
    googleMapLink: { type: String },
    locality: { type: String }
  },
  images: { type: [String], default: [] },
  landParcel: { type: Number },
  towers: { type: Number },
  configurations: [
    { bhk: { type: String }, carpetArea: { type: Number } }
  ],
  reraNumbers: { type: [String], default: [] },
  possession: {
    target: { type: String, required: true },
    reraPossession: { type: String }
  },
  about: { type: String },
  prosAndCons: {
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] }
  },
  videoLink: { type: String },
  internalAmenities: { type: [String], default: [] },
  externalAmenities: { type: [String], default: [] },
  masterPlanImage: { type: String },
  floorPlanImage: { type: String },
  pricingDetails: [
    {
      carpetArea: { type: Number },
      totalPrice: { type: Number },
      downPayment: { type: Number },
      parking: { type: Number },
      unitPlanImage: { type: String }
    }
  ],
  paymentScheme: { type: String },
  offer: { type: String },
  faqs: [
    { question: { type: String }, answer: { type: String } }
  ]
}, { timestamps: true });


export default mongoose.model<IProperty>('Property', propertySchema);