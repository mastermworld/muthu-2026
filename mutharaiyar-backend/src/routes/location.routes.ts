import { Router } from 'express';
import {
  getAllCountries,
  getStates,
  getDistricts,
  getTaluks,
  getVillages,
  searchLocationsByQuery,
  getHierarchy
} from '../controllers/location.controller';

const router = Router();

// Get all countries
router.get('/locations/countries', getAllCountries);

// Get location hierarchy
router.get('/locations/hierarchy', getHierarchy);

// Search locations
router.get('/locations/search', searchLocationsByQuery);

// Get states by country
router.get('/locations/states/:country', getStates);

// Get districts by state
router.get('/locations/districts/:state', getDistricts);

// Get taluks by district
router.get('/locations/taluks/:district', getTaluks);

// Get villages by taluk
router.get('/locations/villages/:taluk', getVillages);

export default router; 