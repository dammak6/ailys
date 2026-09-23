/**
 * AÏLYS Dedicated PostgreSQL Database Adapter (STANDBY / INACTIVE)
 * 
 * IMPORTANT ARCHITECTURAL DIRECTIVE:
 * This adapter is currently DORMANT. It does NOT connect or attempt to connect to any database.
 * The active runtime engine is the local JSON repository (data/admin-data.json).
 * 
 * This adapter will be activated ONLY after the dedicated AÏLYS PostgreSQL database
 * has been created and explicit configuration (DATABASE_URL / SUPABASE credentials) is provided.
 */

import { Product, Collection, HomepageSection } from "../data";
import { CreateOrderParams, CreateReturnParams } from "./repository";

export interface IAilysDatabaseAdapter {
  readonly isConnected: boolean;
  getProducts(filters?: { category?: string; size?: string; sortBy?: "newest" | "price-asc" | "price-desc" }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getCollections(): Promise<Collection[]>;
  getCollectionBySlug(slug: string): Promise<Collection | null>;
  createOrder(params: CreateOrderParams): Promise<{ orderCode: string; orderId: string; subtotal: number; shippingFee: number; total: number }>;
  getOrders(): Promise<any[]>;
  updateOrderStatus(orderId: string, status: string, changedBy?: string, notes?: string): Promise<any>;
  createReturn(params: CreateReturnParams): Promise<{ requestCode: string; returnId: string }>;
  getReturns(): Promise<any[]>;
  updateReturnStatus(returnId: string, status: string, adminNotes?: string): Promise<any>;
  getHomepageSections(draft?: boolean): Promise<HomepageSection[]>;
  saveHomepageSection(section: HomepageSection, draft?: boolean): Promise<void>;
  getMedia(): Promise<any[]>;
  getSiteSettings(): Promise<any>;
  updateSiteSettings(updates: any): Promise<any>;
}

export class StandbyPostgresAdapter implements IAilysDatabaseAdapter {
  // Adapter remains strictly dormant until explicit database activation
  public readonly isConnected: boolean = false;
  private connectionString: string | null = null;

  constructor(connectionString?: string) {
    this.connectionString = connectionString || null;
  }

  private ensureConnected(): never {
    throw new Error(
      "AÏLYS PostgreSQL Adapter is currently in STANDBY mode. No dedicated AÏLYS database is connected. " +
      "Active operations must continue through the local JSON repository until explicit database provisioning."
    );
  }

  async getProducts(_filters?: { category?: string; size?: string; sortBy?: "newest" | "price-asc" | "price-desc" }): Promise<Product[]> {
    this.ensureConnected();
  }

  async getProductBySlug(_slug: string): Promise<Product | null> {
    this.ensureConnected();
  }

  async getCollections(): Promise<Collection[]> {
    this.ensureConnected();
  }

  async getCollectionBySlug(_slug: string): Promise<Collection | null> {
    this.ensureConnected();
  }

  async createOrder(_params: CreateOrderParams): Promise<{ orderCode: string; orderId: string; subtotal: number; shippingFee: number; total: number }> {
    this.ensureConnected();
  }

  async getOrders(): Promise<any[]> {
    this.ensureConnected();
  }

  async updateOrderStatus(_orderId: string, _status: string, _changedBy?: string, _notes?: string): Promise<any> {
    this.ensureConnected();
  }

  async createReturn(_params: CreateReturnParams): Promise<{ requestCode: string; returnId: string }> {
    this.ensureConnected();
  }

  async getReturns(): Promise<any[]> {
    this.ensureConnected();
  }

  async updateReturnStatus(_returnId: string, _status: string, _adminNotes?: string): Promise<any> {
    this.ensureConnected();
  }

  async getHomepageSections(_draft?: boolean): Promise<HomepageSection[]> {
    this.ensureConnected();
  }

  async saveHomepageSection(_section: HomepageSection, _draft?: boolean): Promise<void> {
    this.ensureConnected();
  }

  async getMedia(): Promise<any[]> {
    this.ensureConnected();
  }

  async getSiteSettings(): Promise<any> {
    this.ensureConnected();
  }

  async updateSiteSettings(_updates: any): Promise<any> {
    this.ensureConnected();
  }
}

/**
 * Singleton standby adapter instance.
 * Active runtime continues using AilysRepository local JSON storage.
 */
export const postgresAdapter = new StandbyPostgresAdapter();
