import type { PetalDataPoint, PetalCategory } from '$lib/types/petal-chart.types';
import { PETAL_LABELS, PETAL_DESCRIPTIONS, PETAL_ORDER } from '$lib/types/petal-chart.types';

export interface CityData {
	id: string;
	name: string;
	country: string;
	center: [number, number];
	zoom: number;
	properties: PropertyLocation[];
}

export interface PropertyLocation {
	id: string;
	name: string;
	address: string;
	lng: number;
	lat: number;
	data: PetalDataPoint[];
}

/**
 * Generate 8-petal property data using the Guardian-grade scoring system
 * Parameters map to the 8 canonical petals in PETAL_ORDER (clockwise from 12:00):
 *
 * QUALITY CROWN (Top):
 * - location (12:00): Walk score, schools, crime, economic drivers
 * - tenancy (1:30): Tenant credit, WALT, rollover risk
 * - condition (10:30): Effective age, building class, deferred maintenance
 *
 * RISK BALANCE (Sides):
 * - compliance (3:00): Title, environmental, permits, Guardian verification
 * - liquidity (9:00): Asset class liquidity, transaction velocity
 *
 * RETURNS (Bottom):
 * - financing (4:30): DSCR, LTV, rate terms
 * - cashflow (6:00): NOI yield, CoC return, occupancy
 * - appreciation (7:30): Market growth, rent trends, value-add upside
 */
/**
 * Clamp a score to the valid 1-8 range
 */
function clampScore(score: number): number {
	return Math.max(1, Math.min(8, score));
}

/**
 * Generate petal data in PETAL_ORDER sequence (clockwise from 12:00)
 * Order: location (12:00), tenancy (1:30), compliance (3:00), financing (4:30),
 *        cashflow (6:00), appreciation (7:30), liquidity (9:00), condition (10:30)
 */
function generatePropertyData(
	location: number,
	tenancy: number,
	compliance: number,
	financing: number,
	cashflow: number,
	appreciation: number,
	liquidity: number,
	condition: number
): PetalDataPoint[] {
	const scores: Record<PetalCategory, number> = {
		location: clampScore(location),
		tenancy: clampScore(tenancy),
		compliance: clampScore(compliance),
		financing: clampScore(financing),
		cashflow: clampScore(cashflow),
		appreciation: clampScore(appreciation),
		liquidity: clampScore(liquidity),
		condition: clampScore(condition)
	};

	return PETAL_ORDER.map((category) => {
		const score = scores[category];
		return {
			id: category,
			label: PETAL_LABELS[category],
			score,
			confidence: 0.7 + Math.random() * 0.3,
			completeness: 0.75 + Math.random() * 0.25,
			trend: score > 7.5 ? 'up' : score < 5 ? 'down' : 'stable',
			category,
			description: PETAL_DESCRIPTIONS[category]
		} as PetalDataPoint;
	});
}

export const worldCities: CityData[] = [
	{
		id: 'new-york',
		name: 'New York',
		country: 'USA',
		center: [-73.985, 40.748],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one57', name: 'One57', address: '157 W 57th St, Manhattan', lng: -73.9787, lat: 40.7651, data: generatePropertyData(7.8, 6.5, 8.0, 7.0, 8.0, 7.5, 7.5, 7.6) },
			{ id: '432-park', name: '432 Park Avenue', address: '432 Park Ave, Manhattan', lng: -73.9716, lat: 40.7614, data: generatePropertyData(8.0, 6.0, 8.0, 6.8, 8.0, 7.2, 7.2, 7.8) },
			{ id: 'central-park-tower', name: 'Central Park Tower', address: '217 W 57th St, Manhattan', lng: -73.9810, lat: 40.7665, data: generatePropertyData(8.0, 6.2, 7.9, 7.0, 7.9, 7.4, 7.4, 7.9) },
			{ id: '111-west-57th', name: 'Steinway Tower', address: '111 W 57th St, Manhattan', lng: -73.9775, lat: 40.7648, data: generatePropertyData(8.0, 6.0, 8.0, 6.8, 7.8, 7.3, 7.2, 7.8) },
			{ id: '220-central-park', name: '220 Central Park South', address: '220 Central Park S, Manhattan', lng: -73.9808, lat: 40.7669, data: generatePropertyData(7.9, 5.8, 7.9, 6.6, 8.0, 7.0, 7.0, 7.8) },
			{ id: 'the-greenwich-lane', name: 'The Greenwich Lane', address: '155 W 11th St, Greenwich Village', lng: -73.9995, lat: 40.7350, data: generatePropertyData(7.5, 7.0, 7.5, 7.5, 7.6, 7.8, 7.8, 7.2) },
			{ id: 'one-manhattan-square', name: 'One Manhattan Square', address: '252 South St, Lower East Side', lng: -73.9875, lat: 40.7108, data: generatePropertyData(7.6, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.3) },
			{ id: 'the-xi', name: 'The XI', address: '76 11th Ave, Chelsea', lng: -74.0055, lat: 40.7445, data: generatePropertyData(7.8, 7.0, 7.5, 7.2, 7.5, 7.5, 7.5, 7.3) },
			{ id: '15-hudson-yards', name: '15 Hudson Yards', address: '15 Hudson Yards, Manhattan', lng: -74.0010, lat: 40.7540, data: generatePropertyData(8.0, 7.0, 7.7, 7.5, 7.8, 7.8, 7.8, 7.5) },
			{ id: '35-hudson-yards', name: '35 Hudson Yards', address: '35 Hudson Yards, Manhattan', lng: -74.0005, lat: 40.7545, data: generatePropertyData(7.9, 7.0, 7.8, 7.2, 7.8, 7.5, 7.8, 7.7) },
			{ id: '56-leonard', name: '56 Leonard Street', address: '56 Leonard St, Tribeca', lng: -74.0070, lat: 40.7175, data: generatePropertyData(7.8, 7.2, 7.7, 7.6, 7.8, 8.0, 8.0, 7.3) },
			{ id: '70-vestry', name: '70 Vestry', address: '70 Vestry St, Tribeca', lng: -74.0095, lat: 40.7215, data: generatePropertyData(8.0, 7.0, 7.8, 7.5, 8.0, 7.8, 7.8, 7.5) }
		]
	},
	{
		id: 'london',
		name: 'London',
		country: 'UK',
		center: [-0.1276, 51.5074],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one-hyde-park', name: 'One Hyde Park', address: '100 Knightsbridge, SW1X', lng: -0.1605, lat: 51.5025, data: generatePropertyData(8.0, 5.5, 8.0, 6.5, 8.0, 6.8, 6.8, 7.5) },
			{ id: 'the-shard', name: 'The Shard Residences', address: '32 London Bridge St, SE1', lng: -0.0865, lat: 51.5045, data: generatePropertyData(7.8, 6.0, 8.0, 6.8, 8.0, 7.2, 7.2, 7.3) },
			{ id: 'chelsea-barracks', name: 'Chelsea Barracks', address: 'Chelsea Bridge Rd, SW1W', lng: -0.1485, lat: 51.4885, data: generatePropertyData(8.0, 5.8, 7.9, 6.6, 7.9, 7.0, 7.0, 7.7) },
			{ id: 'one-blackfriars', name: 'One Blackfriars', address: '1 Blackfriars Rd, SE1', lng: -0.1035, lat: 51.5065, data: generatePropertyData(7.7, 6.5, 7.7, 7.2, 7.7, 7.5, 7.5, 7.3) },
			{ id: 'battersea-power', name: 'Battersea Power Station', address: 'Circus Rd W, SW11', lng: -0.1435, lat: 51.4795, data: generatePropertyData(8.0, 7.0, 7.5, 7.5, 7.5, 7.8, 7.8, 7.5) },
			{ id: 'principal-tower', name: 'Principal Tower', address: 'Worship St, EC2A', lng: -0.0785, lat: 51.5225, data: generatePropertyData(7.5, 7.0, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'south-bank-tower', name: 'South Bank Tower', address: '55 Upper Ground, SE1', lng: -0.1055, lat: 51.5075, data: generatePropertyData(7.3, 6.8, 7.2, 7.5, 7.2, 7.8, 7.8, 7.0) },
			{ id: 'landmark-pinnacle', name: 'Landmark Pinnacle', address: '1 Marsh Wall, E14', lng: -0.0155, lat: 51.5015, data: generatePropertyData(7.5, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.3) },
			{ id: 'embassy-gardens', name: 'Embassy Gardens', address: 'Embassy Gardens, SW11', lng: -0.1405, lat: 51.4825, data: generatePropertyData(7.3, 7.1, 7.2, 7.5, 7.2, 7.6, 7.6, 7.2) },
			{ id: 'southbank-place', name: 'Southbank Place', address: 'Belvedere Rd, SE1', lng: -0.1155, lat: 51.5025, data: generatePropertyData(7.7, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'newfoundland', name: 'Newfoundland', address: 'Newfoundland Pl, E14', lng: -0.0205, lat: 51.5015, data: generatePropertyData(7.5, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.3) },
			{ id: '250-city-road', name: '250 City Road', address: '250 City Rd, EC1V', lng: -0.0925, lat: 51.5305, data: generatePropertyData(7.4, 7.2, 7.2, 7.5, 7.2, 7.6, 7.6, 7.2) }
		]
	},
	{
		id: 'dubai',
		name: 'Dubai',
		country: 'UAE',
		center: [55.2708, 25.2048],
		zoom: 11,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'burj-khalifa', name: 'Burj Khalifa Residences', address: 'Sheikh Mohammed bin Rashid Blvd', lng: 55.2744, lat: 25.1972, data: generatePropertyData(8.0, 7.0, 8.0, 7.5, 8.0, 7.6, 7.6, 7.7) },
			{ id: 'address-downtown', name: 'Address Downtown', address: 'Mohammed Bin Rashid Blvd', lng: 55.2755, lat: 25.1950, data: generatePropertyData(7.8, 6.8, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'one-zaabeel', name: 'One Za\'abeel', address: 'Trade Centre Area', lng: 55.2895, lat: 25.2225, data: generatePropertyData(7.9, 7.0, 7.9, 7.5, 7.9, 7.6, 7.6, 7.8) },
			{ id: 'palm-atlantis', name: 'Atlantis The Royal', address: 'Palm Jumeirah', lng: 55.1175, lat: 25.1305, data: generatePropertyData(8.0, 6.5, 8.0, 7.2, 8.0, 7.5, 7.5, 7.5) },
			{ id: 'bulgari-resort', name: 'Bulgari Resort Residences', address: 'Jumeira Bay', lng: 55.2125, lat: 25.2075, data: generatePropertyData(7.9, 6.2, 7.9, 7.0, 7.9, 7.4, 7.4, 7.7) },
			{ id: 'marina-101', name: 'Marina 101', address: 'Dubai Marina', lng: 55.1435, lat: 25.0815, data: generatePropertyData(7.7, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'cayan-tower', name: 'Cayan Tower', address: 'Dubai Marina', lng: 55.1405, lat: 25.0785, data: generatePropertyData(7.5, 6.8, 7.3, 7.5, 7.3, 7.8, 7.8, 7.2) },
			{ id: 'princess-tower', name: 'Princess Tower', address: 'Dubai Marina', lng: 55.1425, lat: 25.0875, data: generatePropertyData(7.3, 7.0, 7.2, 7.5, 7.2, 7.6, 7.6, 7.2) },
			{ id: 'palm-shoreline', name: 'Palm Shoreline Apartments', address: 'Palm Jumeirah', lng: 55.1285, lat: 25.1125, data: generatePropertyData(7.5, 6.8, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'index-tower', name: 'Index Tower', address: 'DIFC', lng: 55.2815, lat: 25.2145, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.6, 7.6, 7.5) },
			{ id: 'address-blvd', name: 'Address Boulevard', address: 'Downtown Dubai', lng: 55.2775, lat: 25.1925, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.6, 7.6, 7.7) },
			{ id: 'the-opus', name: 'The Opus', address: 'Business Bay', lng: 55.2655, lat: 25.1845, data: generatePropertyData(8.0, 7.0, 8.0, 7.5, 8.0, 7.6, 7.6, 7.7) }
		]
	},
	{
		id: 'singapore',
		name: 'Singapore',
		country: 'Singapore',
		center: [103.8198, 1.3521],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'wallich-residence', name: 'Wallich Residence', address: '3 Wallich St, Tanjong Pagar', lng: 103.8435, lat: 1.2785, data: generatePropertyData(8.0, 6.8, 7.9, 7.2, 7.9, 7.5, 7.5, 7.7) },
			{ id: 'marina-one', name: 'Marina One Residences', address: '21 Marina Way', lng: 103.8535, lat: 1.2825, data: generatePropertyData(7.8, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'reflections-keppel', name: 'Reflections at Keppel Bay', address: 'Keppel Bay Dr', lng: 103.8165, lat: 1.2675, data: generatePropertyData(7.7, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'd-leedon', name: 'd\'Leedon', address: 'Leedon Heights', lng: 103.7985, lat: 1.3125, data: generatePropertyData(7.8, 7.2, 7.7, 7.5, 7.7, 7.6, 7.6, 7.5) },
			{ id: 'the-sail', name: 'The Sail @ Marina Bay', address: '2 Marina Blvd', lng: 103.8545, lat: 1.2835, data: generatePropertyData(7.7, 6.8, 7.8, 7.5, 7.8, 7.8, 7.8, 7.3) },
			{ id: 'ardmore-park', name: 'Ardmore Park', address: '11 Ardmore Park', lng: 103.8285, lat: 1.3065, data: generatePropertyData(7.8, 6.8, 8.0, 7.2, 8.0, 7.5, 7.5, 7.5) },
			{ id: 'orchard-residences', name: 'Orchard Residences', address: '1 Orchard Turn', lng: 103.8315, lat: 1.3045, data: generatePropertyData(8.0, 7.0, 7.9, 7.5, 7.9, 7.8, 7.8, 7.7) },
			{ id: 'the-interlace', name: 'The Interlace', address: '180 Depot Rd', lng: 103.8015, lat: 1.2835, data: generatePropertyData(7.8, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'cape-royale', name: 'Cape Royale', address: 'Cove Way, Sentosa', lng: 103.8345, lat: 1.2535, data: generatePropertyData(8.0, 6.8, 8.0, 7.2, 8.0, 7.5, 7.5, 7.7) },
			{ id: 'marina-bay-suites', name: 'Marina Bay Suites', address: '12 Marina Blvd', lng: 103.8555, lat: 1.2815, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.8, 7.8, 7.5) },
			{ id: 'south-beach', name: 'South Beach Residences', address: '26 Beach Rd', lng: 103.8555, lat: 1.2955, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.6, 7.6, 7.5) },
			{ id: 'park-nova', name: 'Park Nova', address: '6 Tomlinson Rd', lng: 103.8295, lat: 1.3055, data: generatePropertyData(8.0, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.7) }
		]
	},
	{
		id: 'hong-kong',
		name: 'Hong Kong',
		country: 'China',
		center: [114.1694, 22.3193],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'the-opus-hk', name: 'Opus Hong Kong', address: '53 Stubbs Rd, The Peak', lng: 114.1705, lat: 22.2625, data: generatePropertyData(7.9, 5.5, 8.0, 6.5, 8.0, 6.8, 6.8, 7.7) },
			{ id: 'mount-nicholson', name: 'Mount Nicholson', address: '8 Mount Nicholson Rd', lng: 114.1685, lat: 22.2645, data: generatePropertyData(8.0, 5.8, 7.9, 6.6, 7.9, 7.0, 7.0, 7.5) },
			{ id: 'one-harbourfront', name: 'One Harbourfront', address: '1 Harbour Rd, Wan Chai', lng: 114.1745, lat: 22.2815, data: generatePropertyData(7.8, 6.5, 8.0, 7.2, 8.0, 7.5, 7.5, 7.5) },
			{ id: 'the-cullinan', name: 'The Cullinan', address: '1 Austin Rd W, Kowloon', lng: 114.1605, lat: 22.3035, data: generatePropertyData(7.8, 6.8, 7.8, 7.5, 7.8, 7.8, 7.8, 7.3) },
			{ id: 'the-arch', name: 'The Arch', address: '1 Austin Rd W, Kowloon', lng: 114.1595, lat: 22.3025, data: generatePropertyData(7.5, 6.5, 7.7, 7.2, 7.7, 7.5, 7.5, 7.2) },
			{ id: 'sorrento', name: 'Sorrento', address: '1 Austin Rd W, Kowloon', lng: 114.1615, lat: 22.3045, data: generatePropertyData(7.4, 6.8, 7.3, 7.5, 7.3, 7.8, 7.8, 7.2) },
			{ id: 'icc-residence', name: 'The Ritz-Carlton Residences', address: '1 Austin Rd W, Kowloon', lng: 114.1585, lat: 22.3015, data: generatePropertyData(8.0, 6.0, 7.9, 6.8, 7.9, 7.2, 7.2, 7.7) },
			{ id: 'the-masterpiece', name: 'The Masterpiece', address: '18 Hanoi Rd, Tsim Sha Tsui', lng: 114.1715, lat: 22.2985, data: generatePropertyData(7.7, 6.8, 7.7, 7.5, 7.7, 7.8, 7.8, 7.3) },
			{ id: 'victoria-harbour', name: 'Victoria Harbour', address: '188 Victoria Harbour', lng: 114.1855, lat: 22.3175, data: generatePropertyData(7.3, 7.0, 7.2, 7.5, 7.2, 7.6, 7.6, 7.1) },
			{ id: 'marinella', name: 'Marinella', address: 'Wong Chuk Hang', lng: 114.1645, lat: 22.2475, data: generatePropertyData(7.6, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.2) },
			{ id: 'residence-bel-air', name: 'Residence Bel-Air', address: 'Pok Fu Lam', lng: 114.1305, lat: 22.2535, data: generatePropertyData(7.7, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.3) },
			{ id: 'the-belcher', name: 'The Belcher\'s', address: 'Kennedy Town', lng: 114.1285, lat: 22.2855, data: generatePropertyData(7.4, 6.8, 7.3, 7.5, 7.3, 7.8, 7.8, 7.2) }
		]
	},
	{
		id: 'tokyo',
		name: 'Tokyo',
		country: 'Japan',
		center: [139.6917, 35.6895],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'azabudai-hills', name: 'Azabudai Hills Residence', address: '1 Azabudai, Minato', lng: 139.7385, lat: 35.6605, data: generatePropertyData(7.9, 6.8, 7.9, 7.2, 7.9, 7.5, 7.5, 7.8) },
			{ id: 'toranomon-hills', name: 'Toranomon Hills Residence', address: '1 Toranomon, Minato', lng: 139.7495, lat: 35.6665, data: generatePropertyData(7.8, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'ark-hills', name: 'Ark Hills Sengokuyama', address: '1 Roppongi, Minato', lng: 139.7405, lat: 35.6635, data: generatePropertyData(7.7, 6.5, 7.8, 7.2, 7.8, 7.5, 7.5, 7.3) },
			{ id: 'roppongi-hills', name: 'Roppongi Hills Residence', address: '6 Roppongi, Minato', lng: 139.7295, lat: 35.6595, data: generatePropertyData(7.8, 6.8, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'the-roppongi-tokyo', name: 'The Roppongi Tokyo', address: '3 Roppongi, Minato', lng: 139.7315, lat: 35.6625, data: generatePropertyData(7.5, 6.8, 7.5, 7.5, 7.5, 7.8, 7.8, 7.2) },
			{ id: 'park-court-akasaka', name: 'Park Court Akasaka', address: '9 Akasaka, Minato', lng: 139.7365, lat: 35.6725, data: generatePropertyData(7.7, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.3) },
			{ id: 'brillia-towers', name: 'Brillia Towers Meguro', address: 'Meguro', lng: 139.7155, lat: 35.6335, data: generatePropertyData(7.4, 6.8, 7.3, 7.5, 7.3, 7.8, 7.8, 7.2) },
			{ id: 'the-tokyo-towers', name: 'The Tokyo Towers', address: 'Kachidoki, Chuo', lng: 139.7755, lat: 35.6565, data: generatePropertyData(7.4, 7.0, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'harumi-flag', name: 'Harumi Flag', address: 'Harumi, Chuo', lng: 139.7855, lat: 35.6445, data: generatePropertyData(7.7, 7.2, 7.2, 7.5, 7.2, 7.8, 7.8, 7.3) },
			{ id: 'park-city-toyosu', name: 'Park City Toyosu', address: 'Toyosu, Koto', lng: 139.8005, lat: 35.6515, data: generatePropertyData(7.2, 7.0, 7.2, 7.5, 7.2, 7.6, 7.6, 7.0) },
			{ id: 'branz-tower', name: 'Branz Tower Shibaura', address: 'Shibaura, Minato', lng: 139.7515, lat: 35.6445, data: generatePropertyData(7.4, 7.0, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'la-tour', name: 'La Tour Shibuya', address: 'Shibuya', lng: 139.6985, lat: 35.6615, data: generatePropertyData(7.5, 6.8, 7.5, 7.5, 7.5, 7.8, 7.8, 7.2) }
		]
	},
	{
		id: 'sydney',
		name: 'Sydney',
		country: 'Australia',
		center: [151.2093, -33.8688],
		zoom: 13,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one-barangaroo', name: 'One Barangaroo', address: 'Hickson Rd, Barangaroo', lng: 151.2015, lat: -33.8595, data: generatePropertyData(8.0, 6.8, 7.9, 7.2, 7.9, 7.5, 7.5, 7.7) },
			{ id: 'crown-sydney', name: 'Crown Residences', address: 'Barangaroo Ave', lng: 151.2005, lat: -33.8615, data: generatePropertyData(7.9, 6.5, 7.9, 7.0, 7.9, 7.4, 7.4, 7.8) },
			{ id: 'anadara', name: 'Anadara', address: '15 Bowman St, Pyrmont', lng: 151.1945, lat: -33.8685, data: generatePropertyData(7.4, 7.0, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'the-residence', name: 'The Residence Sydney', address: '111 Macquarie St', lng: 151.2135, lat: -33.8615, data: generatePropertyData(7.8, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'opera-residences', name: 'Opera Residences', address: '71 Macquarie St', lng: 151.2145, lat: -33.8595, data: generatePropertyData(8.0, 6.8, 7.9, 7.2, 7.9, 7.5, 7.5, 7.7) },
			{ id: 'one-circular-quay', name: 'One Circular Quay', address: 'Circular Quay', lng: 151.2115, lat: -33.8605, data: generatePropertyData(7.8, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'world-tower-sydney', name: 'World Tower', address: '91 Liverpool St', lng: 151.2075, lat: -33.8765, data: generatePropertyData(7.3, 7.0, 7.2, 7.5, 7.2, 7.6, 7.6, 7.1) },
			{ id: 'greenland-centre', name: 'Greenland Centre', address: '115 Bathurst St', lng: 151.2075, lat: -33.8755, data: generatePropertyData(7.5, 7.0, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'darling-square', name: 'Darling Square', address: 'Darling Square, Haymarket', lng: 151.1995, lat: -33.8785, data: generatePropertyData(7.5, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'the-quay', name: 'The Quay', address: '2 Phillip St', lng: 151.2125, lat: -33.8625, data: generatePropertyData(7.7, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.3) },
			{ id: 'one-darling-harbour', name: 'One Darling Harbour', address: '50 Murray St, Pyrmont', lng: 151.1965, lat: -33.8695, data: generatePropertyData(7.6, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.2) },
			{ id: 'marque-apartments', name: 'Marque Apartments', address: '351 Kent St', lng: 151.2045, lat: -33.8655, data: generatePropertyData(7.2, 6.8, 7.2, 7.5, 7.2, 7.6, 7.6, 7.0) }
		]
	},
	{
		id: 'paris',
		name: 'Paris',
		country: 'France',
		center: [2.3522, 48.8566],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'avenue-foch', name: '55 Avenue Foch', address: '55 Avenue Foch, 16e', lng: 2.2835, lat: 48.8722, data: generatePropertyData(8.0, 5.5, 8.0, 6.5, 8.0, 6.8, 6.8, 7.5) },
			{ id: 'place-vendome', name: 'Place Vendome Residence', address: 'Place Vendome, 1er', lng: 2.3295, lat: 48.8675, data: generatePropertyData(7.8, 5.8, 7.9, 6.6, 7.9, 7.0, 7.0, 7.3) },
			{ id: 'saint-germain', name: 'Saint Germain des Pres', address: 'Rue de Rennes, 6e', lng: 2.3315, lat: 48.8535, data: generatePropertyData(7.7, 6.2, 8.0, 6.8, 8.0, 7.2, 7.2, 7.2) },
			{ id: 'ile-saint-louis', name: 'Ile Saint Louis', address: 'Quai d\'Orleans, 4e', lng: 2.3555, lat: 48.8515, data: generatePropertyData(7.8, 5.8, 7.9, 6.6, 7.9, 7.0, 7.0, 7.3) },
			{ id: 'marais-residence', name: 'Le Marais Residence', address: 'Rue des Francs Bourgeois, 3e', lng: 2.3615, lat: 48.8575, data: generatePropertyData(7.5, 6.5, 7.8, 7.0, 7.8, 7.4, 7.4, 7.2) },
			{ id: 'la-defense-aria', name: 'Aria La Defense', address: 'Esplanade de La Defense', lng: 2.2365, lat: 48.8915, data: generatePropertyData(7.7, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.3) },
			{ id: 'tour-first', name: 'Tour First Residences', address: 'La Defense', lng: 2.2385, lat: 48.8895, data: generatePropertyData(7.8, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.5) },
			{ id: 'hermitage-plaza', name: 'Hermitage Plaza', address: 'La Defense', lng: 2.2405, lat: 48.8875, data: generatePropertyData(8.0, 7.2, 7.7, 7.5, 7.7, 7.6, 7.6, 7.7) },
			{ id: 'batignolles', name: 'Eco-Quartier Batignolles', address: '17e Arrondissement', lng: 2.3145, lat: 48.8915, data: generatePropertyData(7.5, 7.2, 7.2, 7.5, 7.2, 7.6, 7.6, 7.2) },
			{ id: 'duo-towers', name: 'Tours Duo', address: '13e Arrondissement', lng: 2.3815, lat: 48.8295, data: generatePropertyData(7.8, 7.4, 7.5, 7.6, 7.5, 7.8, 7.8, 7.5) },
			{ id: 'passy-residence', name: 'Passy Kennedy', address: 'Rue de Passy, 16e', lng: 2.2785, lat: 48.8565, data: generatePropertyData(7.5, 6.5, 7.7, 7.0, 7.7, 7.4, 7.4, 7.2) },
			{ id: 'neuilly-residence', name: 'Neuilly Sur Seine', address: 'Avenue Charles de Gaulle', lng: 2.2715, lat: 48.8855, data: generatePropertyData(7.5, 6.2, 7.8, 6.8, 7.8, 7.2, 7.2, 7.2) }
		]
	},
	{
		id: 'miami',
		name: 'Miami',
		country: 'USA',
		center: [-80.1918, 25.7617],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one-thousand-museum', name: 'One Thousand Museum', address: '1000 Biscayne Blvd', lng: -80.1865, lat: 25.7855, data: generatePropertyData(8.0, 6.8, 7.9, 7.2, 7.9, 7.5, 7.5, 7.7) },
			{ id: 'aston-martin', name: 'Aston Martin Residences', address: '300 Biscayne Blvd Way', lng: -80.1855, lat: 25.7735, data: generatePropertyData(7.9, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.8) },
			{ id: 'waldorf-astoria', name: 'Waldorf Astoria Residences', address: '300 Biscayne Blvd', lng: -80.1845, lat: 25.7745, data: generatePropertyData(7.9, 6.8, 7.9, 7.2, 7.9, 7.5, 7.5, 7.8) },
			{ id: 'brickell-flatiron', name: 'Brickell Flatiron', address: '1001 S Miami Ave', lng: -80.1925, lat: 25.7635, data: generatePropertyData(7.8, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.5) },
			{ id: 'panorama-tower', name: 'Panorama Tower', address: '1100 Brickell Bay Dr', lng: -80.1905, lat: 25.7605, data: generatePropertyData(7.7, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'icon-brickell', name: 'Icon Brickell', address: '465 Brickell Ave', lng: -80.1885, lat: 25.7665, data: generatePropertyData(7.5, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.2) },
			{ id: 'the-four-seasons', name: 'Four Seasons Surf Club', address: '9011 Collins Ave, Surfside', lng: -80.1235, lat: 25.8825, data: generatePropertyData(7.8, 6.5, 8.0, 7.0, 8.0, 7.4, 7.4, 7.5) },
			{ id: 'faena-house', name: 'Faena House', address: '3315 Collins Ave, Miami Beach', lng: -80.1285, lat: 25.8095, data: generatePropertyData(7.8, 6.5, 8.0, 7.0, 8.0, 7.4, 7.4, 7.5) },
			{ id: 'apogee-south-beach', name: 'Apogee South Beach', address: '800 S Pointe Dr', lng: -80.1365, lat: 25.7645, data: generatePropertyData(7.8, 6.8, 7.8, 7.2, 7.8, 7.5, 7.5, 7.5) },
			{ id: 'porsche-design', name: 'Porsche Design Tower', address: '18555 Collins Ave, Sunny Isles', lng: -80.1205, lat: 25.9405, data: generatePropertyData(8.0, 6.8, 8.0, 7.2, 8.0, 7.5, 7.5, 7.7) },
			{ id: 'armani-casa', name: 'Armani Casa', address: '18975 Collins Ave, Sunny Isles', lng: -80.1215, lat: 25.9455, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.8, 7.8, 7.5) },
			{ id: 'cipriani-brickell', name: 'Cipriani Residences', address: '1420 S Miami Ave', lng: -80.1945, lat: 25.7565, data: generatePropertyData(8.0, 7.0, 7.8, 7.5, 7.8, 7.6, 7.6, 7.7) }
		]
	},
	{
		id: 'los-angeles',
		name: 'Los Angeles',
		country: 'USA',
		center: [-118.2437, 34.0522],
		zoom: 11,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one-beverly-hills', name: 'One Beverly Hills', address: '9900 Wilshire Blvd', lng: -118.4045, lat: 34.0645, data: generatePropertyData(7.9, 6.0, 7.9, 6.8, 7.9, 7.2, 7.2, 7.8) },
			{ id: 'century-city-plaza', name: 'The Century', address: '10250 Constellation Blvd', lng: -118.4165, lat: 34.0565, data: generatePropertyData(7.7, 7.0, 7.7, 7.5, 7.7, 7.8, 7.8, 7.3) },
			{ id: 'ten-thousand', name: 'Ten Thousand', address: '10000 Santa Monica Blvd', lng: -118.4135, lat: 34.0685, data: generatePropertyData(7.7, 6.8, 7.8, 7.2, 7.8, 7.5, 7.5, 7.3) },
			{ id: 'the-towers', name: 'The Towers of Beverly Hills', address: '1201 S Roxbury Dr', lng: -118.3985, lat: 34.0545, data: generatePropertyData(7.5, 6.8, 7.5, 7.5, 7.5, 7.8, 7.8, 7.2) },
			{ id: 'ritz-carlton-la', name: 'Ritz-Carlton Residences LA', address: '900 W Olympic Blvd', lng: -118.2605, lat: 34.0445, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.6, 7.6, 7.5) },
			{ id: 'ten-fifty-b', name: 'Ten Fifty B', address: '1050 S Grand Ave', lng: -118.2565, lat: 34.0415, data: generatePropertyData(7.5, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'circa-dtla', name: 'Circa LA', address: '1200 S Figueroa St', lng: -118.2655, lat: 34.0385, data: generatePropertyData(7.4, 7.2, 7.2, 7.5, 7.2, 7.6, 7.6, 7.2) },
			{ id: 'metropolis-la', name: 'Metropolis LA', address: '899 Francisco St', lng: -118.2575, lat: 34.0465, data: generatePropertyData(7.5, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'oceanwide-plaza', name: 'Oceanwide Plaza', address: '1101 S Flower St', lng: -118.2635, lat: 34.0405, data: generatePropertyData(7.7, 7.3, 7.5, 7.6, 7.5, 7.8, 7.8, 7.3) },
			{ id: 'the-grand-la', name: 'The Grand LA', address: '100 S Grand Ave', lng: -118.2485, lat: 34.0535, data: generatePropertyData(7.8, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.5) },
			{ id: 'marina-del-rey', name: 'Azzurra Marina del Rey', address: '13750 Fiji Way', lng: -118.4485, lat: 33.9735, data: generatePropertyData(7.4, 7.0, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'shore-club', name: 'Shore Club Santa Monica', address: '655 Ocean Ave', lng: -118.4925, lat: 34.0085, data: generatePropertyData(7.5, 6.8, 7.7, 7.5, 7.7, 7.8, 7.8, 7.2) }
		]
	},
	{
		id: 'manila',
		name: 'Manila',
		country: 'Philippines',
		center: [121.0244, 14.5547],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one-serendra', name: 'One Serendra', address: '11th Ave, BGC, Taguig', lng: 121.0465, lat: 14.5515, data: generatePropertyData(7.8, 7.2, 7.7, 7.5, 7.7, 7.6, 7.6, 7.5) },
			{ id: 'grand-hyatt-manila', name: 'Grand Hyatt Manila Residences', address: '8th Ave, BGC, Taguig', lng: 121.0485, lat: 14.5535, data: generatePropertyData(8.0, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.7) },
			{ id: 'the-suites', name: 'The Suites at One Bonifacio High Street', address: '5th Ave, BGC, Taguig', lng: 121.0445, lat: 14.5505, data: generatePropertyData(7.7, 7.1, 7.8, 7.5, 7.8, 7.8, 7.8, 7.3) },
			{ id: 'east-gallery-place', name: 'East Gallery Place', address: '28th St, BGC, Taguig', lng: 121.0455, lat: 14.5495, data: generatePropertyData(7.5, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.2) },
			{ id: 'west-gallery-place', name: 'West Gallery Place', address: '28th St, BGC, Taguig', lng: 121.0435, lat: 14.5485, data: generatePropertyData(7.5, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.2) },
			{ id: 'shang-grand-tower', name: 'Shang Grand Tower', address: 'St Francis St, Mandaluyong', lng: 121.0565, lat: 14.5815, data: generatePropertyData(7.7, 6.8, 7.8, 7.2, 7.8, 7.5, 7.5, 7.3) },
			{ id: 'rockwell-proscenium', name: 'The Proscenium at Rockwell', address: 'Rockwell Center, Makati', lng: 121.0355, lat: 14.5645, data: generatePropertyData(7.8, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.5) },
			{ id: 'trump-tower-manila', name: 'Trump Tower Manila', address: 'Century City, Makati', lng: 121.0315, lat: 14.5665, data: generatePropertyData(7.8, 6.8, 7.7, 7.2, 7.7, 7.5, 7.5, 7.3) },
			{ id: 'park-terraces', name: 'Park Terraces', address: 'Ayala Center, Makati', lng: 121.0235, lat: 14.5585, data: generatePropertyData(7.5, 6.8, 7.5, 7.5, 7.5, 7.8, 7.8, 7.2) },
			{ id: 'discovery-primea', name: 'Discovery Primea', address: '6749 Ayala Ave, Makati', lng: 121.0265, lat: 14.5555, data: generatePropertyData(7.8, 6.8, 7.8, 7.2, 7.8, 7.5, 7.5, 7.5) },
			{ id: 'essensa-east-forbes', name: 'Essensa East Forbes', address: 'Rizal Dr, BGC, Taguig', lng: 121.0515, lat: 14.5475, data: generatePropertyData(7.7, 7.0, 7.7, 7.5, 7.7, 7.6, 7.6, 7.3) },
			{ id: 'pacific-plaza-towers', name: 'Pacific Plaza Towers', address: 'BGC, Taguig', lng: 121.0475, lat: 14.5455, data: generatePropertyData(7.4, 7.2, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) }
		]
	},
	{
		id: 'san-diego',
		name: 'San Diego',
		country: 'USA',
		center: [-117.1611, 32.7157],
		zoom: 12,
		properties: [
			// New order: location, tenancy, compliance, financing, cashflow, appreciation, liquidity, condition
			{ id: 'one-park-san-diego', name: 'One Park San Diego', address: '800 J St, Downtown', lng: -117.1605, lat: 32.7135, data: generatePropertyData(7.8, 7.2, 7.8, 7.5, 7.8, 7.6, 7.6, 7.5) },
			{ id: 'pacific-gate', name: 'Pacific Gate', address: '888 W E St, Downtown', lng: -117.1715, lat: 32.7175, data: generatePropertyData(8.0, 7.0, 8.0, 7.5, 8.0, 7.8, 7.8, 7.7) },
			{ id: 'pinnacle-marina', name: 'Pinnacle Marina Tower', address: '550 Front St, Downtown', lng: -117.1695, lat: 32.7145, data: generatePropertyData(7.7, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'electra', name: 'Electra San Diego', address: '700 W E St, Downtown', lng: -117.1685, lat: 32.7165, data: generatePropertyData(7.8, 7.2, 7.7, 7.5, 7.7, 7.6, 7.6, 7.5) },
			{ id: 'horizons-mission-bay', name: 'Horizons Mission Bay', address: '4353 Mission Bay Dr', lng: -117.2115, lat: 32.7785, data: generatePropertyData(7.4, 7.1, 7.3, 7.5, 7.3, 7.6, 7.6, 7.2) },
			{ id: 'the-legend', name: 'The Legend', address: '325 7th Ave, Downtown', lng: -117.1605, lat: 32.7135, data: generatePropertyData(7.5, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.2) },
			{ id: 'savina-sd', name: 'Savina', address: '610 W Ash St, Downtown', lng: -117.1655, lat: 32.7235, data: generatePropertyData(7.7, 7.2, 7.5, 7.5, 7.5, 7.6, 7.6, 7.3) },
			{ id: 'bayside-sd', name: 'Bayside at the Embarcadero', address: '1431 Pacific Hwy', lng: -117.1735, lat: 32.7275, data: generatePropertyData(7.8, 7.0, 7.8, 7.5, 7.8, 7.6, 7.6, 7.5) },
			{ id: 'la-jolla-cove', name: 'La Jolla Cove Condos', address: '939 Coast Blvd, La Jolla', lng: -117.2725, lat: 32.8505, data: generatePropertyData(7.5, 6.5, 8.0, 7.0, 8.0, 7.4, 7.4, 7.2) },
			{ id: 'coronado-shores', name: 'Coronado Shores', address: '1820 Avenida del Mundo, Coronado', lng: -117.1695, lat: 32.6765, data: generatePropertyData(7.5, 6.8, 7.8, 7.2, 7.8, 7.5, 7.5, 7.2) },
			{ id: 'del-mar-heights', name: 'Del Mar Heights Luxury', address: '13500 Del Mar Heights Rd', lng: -117.2535, lat: 32.9415, data: generatePropertyData(7.5, 6.8, 7.7, 7.5, 7.7, 7.8, 7.8, 7.2) },
			{ id: 'banker-hill', name: 'Bankers Hill Penthouse', address: '2500 6th Ave, Bankers Hill', lng: -117.1645, lat: 32.7325, data: generatePropertyData(7.4, 7.0, 7.5, 7.5, 7.5, 7.6, 7.6, 7.2) }
		]
	}
];
