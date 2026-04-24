import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  getCountries,
  getStatesByCountry,
  getDistrictsByState,
  getTaluksByDistrict,
  getVillagesByTaluk,
  searchLocations,
  getLocationHierarchy
} from '../services/enhanced-location.service';
import logger from '../utils/logger';

/**
 * @desc    Get all countries
 * @route   GET /api/locations/countries
 * @access  Public
 */
export const getAllCountries = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const countries = await getCountries();
    res.status(200).json({
      message: 'Countries retrieved successfully',
      data: countries,
      count: countries.length
    });
  } catch (error) {
    logger.error('Error fetching countries:', error);
    res.status(500).json({ message: 'Failed to fetch countries' });
  }
});

/**
 * @desc    Get states by country
 * @route   GET /api/locations/states/:country
 * @access  Public
 */
export const getStates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { country } = req.params;
    
    if (!country) {
      res.status(400).json({ message: 'Country parameter is required' });
      return;
    }

    const states = await getStatesByCountry(country);
    res.status(200).json({
      message: 'States retrieved successfully',
      data: states,
      count: states.length,
      country
    });
  } catch (error) {
    logger.error('Error fetching states:', error);
    res.status(500).json({ message: 'Failed to fetch states' });
  }
});

/**
 * @desc    Get districts by state
 * @route   GET /api/locations/districts/:state
 * @access  Public
 */
export const getDistricts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { state } = req.params;
    
    if (!state) {
      res.status(400).json({ message: 'State parameter is required' });
      return;
    }

    const districts = await getDistrictsByState(state);
    res.status(200).json({
      message: 'Districts retrieved successfully',
      data: districts,
      count: districts.length,
      state
    });
  } catch (error) {
    logger.error('Error fetching districts:', error);
    res.status(500).json({ message: 'Failed to fetch districts' });
  }
});

/**
 * @desc    Get taluks by district
 * @route   GET /api/locations/taluks/:district
 * @access  Public
 */
export const getTaluks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { district } = req.params;
    
    if (!district) {
      res.status(400).json({ message: 'District parameter is required' });
      return;
    }

    const taluks = await getTaluksByDistrict(district);
    res.status(200).json({
      message: 'Taluks retrieved successfully',
      data: taluks,
      count: taluks.length,
      district
    });
  } catch (error) {
    logger.error('Error fetching taluks:', error);
    res.status(500).json({ message: 'Failed to fetch taluks' });
  }
});

/**
 * @desc    Get villages by taluk
 * @route   GET /api/locations/villages/:taluk
 * @access  Public
 */
export const getVillages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { taluk } = req.params;
    
    if (!taluk) {
      res.status(400).json({ message: 'Taluk parameter is required' });
      return;
    }

    const villages = await getVillagesByTaluk(taluk);
    res.status(200).json({
      message: 'Villages retrieved successfully',
      data: villages,
      count: villages.length,
      taluk
    });
  } catch (error) {
    logger.error('Error fetching villages:', error);
    res.status(500).json({ message: 'Failed to fetch villages' });
  }
});

/**
 * @desc    Search locations
 * @route   GET /api/locations/search?q=query&type=state|district|taluk|village&limit=20
 * @access  Public
 */
export const searchLocationsByQuery = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, type, limit } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({ message: 'Search query (q) is required' });
      return;
    }

    if (!type || !['state', 'district', 'taluk', 'village'].includes(type as string)) {
      res.status(400).json({ message: 'Valid type parameter is required (state, district, taluk, village)' });
      return;
    }

    const searchLimit = limit ? parseInt(limit as string) : 20;
    const results = await searchLocations(q, type as 'state' | 'district' | 'taluk' | 'village', searchLimit);
    
    res.status(200).json({
      message: 'Search completed successfully',
      data: results,
      count: results.length,
      query: q,
      type
    });
  } catch (error) {
    logger.error('Error searching locations:', error);
    res.status(500).json({ message: 'Failed to search locations' });
  }
});

/**
 * @desc    Get location hierarchy
 * @route   GET /api/locations/hierarchy?country=&state=&district=&taluk=
 * @access  Public
 */
export const getHierarchy = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, state, district, taluk } = req.query;
    
    const hierarchy = await getLocationHierarchy(
      country as string,
      state as string,
      district as string,
      taluk as string
    );
    
    res.status(200).json({
      message: 'Location hierarchy retrieved successfully',
      data: hierarchy,
      params: { country, state, district, taluk }
    });
  } catch (error) {
    logger.error('Error fetching location hierarchy:', error);
    res.status(500).json({ message: 'Failed to fetch location hierarchy' });
  }
}); 