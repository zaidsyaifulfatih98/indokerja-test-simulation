import type { Job } from './types';

/** SEMENTARA: data dummy untuk pratinjau tampilan saat backend belum jalan. Hapus jika tak dipakai. */
const base = { description: '', requirements: null, createdAt: new Date().toISOString() };

export const MOCK_JOBS: Job[] = [
  { ...base, id: 'm1', title: 'HR Generalist', location: 'Jakarta Barat, DKI Jakarta', salaryMin: 6_000_000, salaryMax: 8_000_000, jobType: 'FULL_TIME', company: { id: 'c1', name: 'PT Putracipta Graha Indah' } },
  { ...base, id: 'm2', title: 'Resepsionis', location: 'Kab. Bekasi, Jawa Barat', salaryMin: 4_900_000, salaryMax: 5_400_000, jobType: 'PART_TIME', company: { id: 'c2', name: 'PT Restoran Domo Sushi' } },
  { ...base, id: 'm3', title: 'Frontend Developer', location: 'Bandung, Jawa Barat', salaryMin: 8_000_000, salaryMax: 12_000_000, jobType: 'CONTRACT', company: { id: 'c3', name: 'Satu Digital' } },
  { ...base, id: 'm4', title: 'Digital Marketing', location: 'Surabaya, Jawa Timur', salaryMin: 5_000_000, salaryMax: null, jobType: 'FULL_TIME', company: { id: 'c4', name: 'Nusantara Media' } },
  { ...base, id: 'm5', title: 'UI/UX Designer Intern', location: 'Yogyakarta, DIY', salaryMin: null, salaryMax: null, jobType: 'INTERNSHIP', company: { id: 'c5', name: 'Kreasi Studio' } },
  { ...base, id: 'm6', title: 'Customer Service', location: 'Tangerang, Banten', salaryMin: 4_000_000, salaryMax: 4_500_000, jobType: 'FULL_TIME', company: { id: 'c6', name: 'Bank Sejahtera' } },
];
