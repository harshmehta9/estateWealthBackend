import mongoose from 'mongoose';

// Enums
enum PriceUnit {
  Lakh = 'Lakh',
  Crore = 'Crore'
}

// Interfaces
interface AreaConfig {
  value: number;
  unit?: string;
}

interface PriceConfig {
  value: number;
  unit: PriceUnit;
}

interface PropertyConfiguration {
  bhkType?: string;
  area: AreaConfig;
  price: PriceConfig;
  bookingAmount: PriceConfig;
  parking?: string;
  googleMapLink?: string;
  aboutProperty:string;
  aboutBuilder: string;
}

interface PropertyDetails {
  landParcel: AreaConfig;
  totalTowers?: number;
  buildingStructures?: string;
  availableTowers?: number;
}

interface PossessionDetails {
  [reraNumber: string]: {
    reraDate?: Date;
    reraImages: string[];
    reraLink?: string;
  }
}

interface ProsAndCons {
  pros?: string;
  cons?: string;
}

interface Amenities {
  indoor: string[];
  outdoor: string[];
  amenityImages: string[];
}

interface MediaAndPlans {
  videoLinks: string[];
  projectLayouts: string[];
  floorLayouts: string[];
  unitPlanLayouts: string[];
}

interface PaymentAndOffers {
  offerText?: string;
  offerImages: string[];
}

interface Specifications {
  specificationImages: string[];
}

// Full Property Interface
interface IProperty extends mongoose.Document {
  configuration: PropertyConfiguration;
  propertyImages: string[];
  propertyDetails: PropertyDetails;
  possession: PossessionDetails;
  prosAndCons: ProsAndCons;
  amenities: Amenities;
  mediaAndPlans: MediaAndPlans;
  location?: string;
  paymentAndOffers: PaymentAndOffers;
  specifications: Specifications;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const PropertySchema = new mongoose.Schema<IProperty>({
  configuration: {
    bhkType: String,
    area: {
      value: Number,
      unit: {
        type: String,
        default: 'sq ft'
      }
    },
    price: {
      value: Number,
      unit: {
        type: String,
        enum: Object.values(PriceUnit)
      }
    },
    bookingAmount: {
      value: Number,
      unit: {
        type: String,
        enum: Object.values(PriceUnit)
      }
    },
    parking: String,
    googleMapLink: String,
    aboutProperty:String,
    aboutBuilder: String
  },
  propertyImages: [String],
  propertyDetails: {
    landParcel: {
      value: Number,
      unit: {
        type: String,
        default: 'Acres'
      }
    },
    totalTowers: Number,
    buildingStructures: String,
    availableTowers: Number
  },
  possession: mongoose.Schema.Types.Mixed,
  prosAndCons: {
    pros: [String],
    cons: [String]
  },
  amenities: {
    indoor: [String],
    outdoor: [String],
    amenityImages: [String]
  },
  mediaAndPlans: {
    videoLinks: [String],
    projectLayoutsImage: [String],
    floorLayoutsImage: [String],
    unitPlanLayoutsImage: [String]
  },
  location: String,
  paymentAndOffers: {
    offerText: String,
    offerImages: [String]
  },
  specifications: {
    specificationImages: [String]
  }
}, {
  timestamps: true
});

// Create the model
const Property = mongoose.model<IProperty>('Property', PropertySchema);

export default Property;