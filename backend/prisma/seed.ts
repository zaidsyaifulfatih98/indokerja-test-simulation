process.loadEnvFile()

import bcrypt from "bcrypt";
import prisma from "../src/configs/pool-connection.config";
import { JobTypes, Roles, Statuses } from "../generated/prisma/client";

const DEMO_PASSWORD = "demo123";

const users = [
    { id: "u-seeker", name: "Budi Santoso", email: "seeker@demo.com", role: Roles.JOB_SEEKER },
    { id: "u-company", name: "PT Putracipta Graha Indah", email: "company@demo.com", role: Roles.COMPANY },
    { id: "u-cand1", name: "Siti Rahma", email: "siti@mail.com", role: Roles.JOB_SEEKER },
    { id: "u-cand2", name: "Andi Pratama", email: "andi@mail.com", role: Roles.JOB_SEEKER },
    { id: "u-cand3", name: "Dewi Lestari", email: "dewi@mail.com", role: Roles.JOB_SEEKER },
    { id: "u-cand4", name: "Rizky Ramadhan", email: "rizky@mail.com", role: Roles.JOB_SEEKER },
    { id: "u-cand5", name: "Maya Putri", email: "maya@mail.com", role: Roles.JOB_SEEKER },
    { id: "u-cand6", name: "Fajar Nugroho", email: "fajar@mail.com", role: Roles.JOB_SEEKER },
    { id: "c-domo", name: "PT Restoran Domo Sushi", email: "c-domo@demo.com", role: Roles.COMPANY },
    { id: "c-satu", name: "Satu Digital", email: "c-satu@demo.com", role: Roles.COMPANY },
    { id: "c-nusa", name: "Nusantara Media", email: "c-nusa@demo.com", role: Roles.COMPANY },
    { id: "c-kreasi", name: "Kreasi Studio", email: "c-kreasi@demo.com", role: Roles.COMPANY },
    { id: "c-bank", name: "Bank Sejahtera", email: "c-bank@demo.com", role: Roles.COMPANY },
];

const jobDescription = (title: string) =>
    `Kami mencari ${title} yang berpengalaman dan bersemangat untuk bergabung dengan tim kami.\n\nTanggung jawab utama meliputi perencanaan, eksekusi, dan pelaporan pekerjaan harian.`;

const jobRequirements =
    "Minimal D3/S1 pada bidang terkait.\nPengalaman 1-3 tahun.\nKomunikasi dan kerja tim yang baik.";

const jobs = [
    { id: "j1", title: "HR Generalist", location: "Jakarta Barat, DKI Jakarta", salaryMin: 6000000, salaryMax: 8000000, jobType: JobTypes.FULL_TIME, createdAt: "2026-09-21T12:00:00Z", companyId: "u-company" },
    { id: "j2", title: "Recruitment Specialist", location: "Jakarta Barat, DKI Jakarta", salaryMin: 7000000, salaryMax: 9000000, jobType: JobTypes.FULL_TIME, createdAt: "2026-09-19T12:00:00Z", companyId: "u-company" },
    { id: "j3", title: "Admin Kantor", location: "Jakarta Barat, DKI Jakarta", salaryMin: 4500000, salaryMax: 5500000, jobType: JobTypes.CONTRACT, createdAt: "2026-09-16T12:00:00Z", companyId: "u-company" },
    { id: "j4", title: "Resepsionis", location: "Kab. Bekasi, Jawa Barat", salaryMin: 4900000, salaryMax: 5400000, jobType: JobTypes.PART_TIME, createdAt: "2026-09-20T12:00:00Z", companyId: "c-domo" },
    { id: "j5", title: "Frontend Developer", location: "Bandung, Jawa Barat", salaryMin: 8000000, salaryMax: 12000000, jobType: JobTypes.CONTRACT, createdAt: "2026-09-18T12:00:00Z", companyId: "c-satu" },
    { id: "j6", title: "Digital Marketing", location: "Surabaya, Jawa Timur", salaryMin: 5000000, salaryMax: null, jobType: JobTypes.FULL_TIME, createdAt: "2026-09-17T12:00:00Z", companyId: "c-nusa" },
    { id: "j7", title: "UI/UX Designer Intern", location: "Yogyakarta, DIY", salaryMin: null, salaryMax: null, jobType: JobTypes.INTERNSHIP, createdAt: "2026-09-15T12:00:00Z", companyId: "c-kreasi" },
    { id: "j8", title: "Customer Service", location: "Tangerang, Banten", salaryMin: 4000000, salaryMax: 4500000, jobType: JobTypes.FULL_TIME, createdAt: "2026-09-14T12:00:00Z", companyId: "c-bank" },
    { id: "j9", title: "Content Creator", location: "Bali", salaryMin: 5000000, salaryMax: 7000000, jobType: JobTypes.FREELANCE, createdAt: "2026-09-13T12:00:00Z", companyId: "c-nusa" },
    { id: "j10", title: "Backend Developer", location: "Jakarta Selatan, DKI Jakarta", salaryMin: 10000000, salaryMax: 15000000, jobType: JobTypes.FULL_TIME, createdAt: "2026-09-12T12:00:00Z", companyId: "c-satu" },
];

const applications = [
    { id: "a1", jobId: "j1", candidateId: "u-cand1", status: Statuses.APPLIED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-16T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a2", jobId: "j1", candidateId: "u-cand2", status: Statuses.REVIEWING, coverLetter: null, createdAt: "2026-09-17T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a3", jobId: "j1", candidateId: "u-cand3", status: Statuses.SHORTLISTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-18T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a4", jobId: "j1", candidateId: "u-cand4", status: Statuses.REJECTED, coverLetter: null, createdAt: "2026-09-19T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a5", jobId: "j1", candidateId: "u-cand5", status: Statuses.ACCEPTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-20T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a6", jobId: "j1", candidateId: "u-cand6", status: Statuses.APPLIED, coverLetter: null, createdAt: "2026-09-21T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a7", jobId: "j2", candidateId: "u-cand1", status: Statuses.REVIEWING, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-16T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a8", jobId: "j2", candidateId: "u-cand2", status: Statuses.SHORTLISTED, coverLetter: null, createdAt: "2026-09-17T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a9", jobId: "j2", candidateId: "u-cand3", status: Statuses.REJECTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-18T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a10", jobId: "j2", candidateId: "u-cand4", status: Statuses.ACCEPTED, coverLetter: null, createdAt: "2026-09-19T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a11", jobId: "j2", candidateId: "u-cand5", status: Statuses.APPLIED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-20T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a12", jobId: "j2", candidateId: "u-cand6", status: Statuses.APPLIED, coverLetter: null, createdAt: "2026-09-21T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a13", jobId: "j3", candidateId: "u-cand1", status: Statuses.SHORTLISTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-16T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a14", jobId: "j3", candidateId: "u-cand2", status: Statuses.REJECTED, coverLetter: null, createdAt: "2026-09-17T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a15", jobId: "j3", candidateId: "u-cand3", status: Statuses.ACCEPTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-18T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a16", jobId: "j4", candidateId: "u-cand1", status: Statuses.REJECTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-16T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a17", jobId: "j4", candidateId: "u-cand2", status: Statuses.ACCEPTED, coverLetter: null, createdAt: "2026-09-17T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a18", jobId: "j4", candidateId: "u-cand3", status: Statuses.APPLIED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-18T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a19", jobId: "j5", candidateId: "u-cand1", status: Statuses.ACCEPTED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-16T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a20", jobId: "j5", candidateId: "u-cand2", status: Statuses.APPLIED, coverLetter: null, createdAt: "2026-09-17T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a21", jobId: "j5", candidateId: "u-cand3", status: Statuses.APPLIED, coverLetter: "Saya tertarik dengan posisi ini dan siap berkontribusi.", createdAt: "2026-09-18T12:00:00Z", updatedAt: "2026-09-19T12:00:00Z" },
    { id: "a-me1", jobId: "j4", candidateId: "u-seeker", status: Statuses.REVIEWING, coverLetter: null, createdAt: "2026-09-20T12:00:00Z", updatedAt: "2026-09-21T12:00:00Z" },
    { id: "a-me2", jobId: "j5", candidateId: "u-seeker", status: Statuses.APPLIED, coverLetter: null, createdAt: "2026-09-21T12:00:00Z", updatedAt: "2026-09-21T12:00:00Z" },
];

const histories = [
    { id: "ha10", applicationId: "a1", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-16T12:00:00Z", changedById: null },
    { id: "ha20", applicationId: "a2", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-17T12:00:00Z", changedById: null },
    { id: "ha21", applicationId: "a2", fromStatus: Statuses.APPLIED, toStatus: Statuses.REVIEWING, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha30", applicationId: "a3", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-18T12:00:00Z", changedById: null },
    { id: "ha31", applicationId: "a3", fromStatus: Statuses.APPLIED, toStatus: Statuses.SHORTLISTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha40", applicationId: "a4", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-19T12:00:00Z", changedById: null },
    { id: "ha41", applicationId: "a4", fromStatus: Statuses.APPLIED, toStatus: Statuses.REJECTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha50", applicationId: "a5", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-20T12:00:00Z", changedById: null },
    { id: "ha51", applicationId: "a5", fromStatus: Statuses.APPLIED, toStatus: Statuses.ACCEPTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha60", applicationId: "a6", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-21T12:00:00Z", changedById: null },
    { id: "ha70", applicationId: "a7", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-16T12:00:00Z", changedById: null },
    { id: "ha71", applicationId: "a7", fromStatus: Statuses.APPLIED, toStatus: Statuses.REVIEWING, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha80", applicationId: "a8", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-17T12:00:00Z", changedById: null },
    { id: "ha81", applicationId: "a8", fromStatus: Statuses.APPLIED, toStatus: Statuses.SHORTLISTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha90", applicationId: "a9", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-18T12:00:00Z", changedById: null },
    { id: "ha91", applicationId: "a9", fromStatus: Statuses.APPLIED, toStatus: Statuses.REJECTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha100", applicationId: "a10", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-19T12:00:00Z", changedById: null },
    { id: "ha101", applicationId: "a10", fromStatus: Statuses.APPLIED, toStatus: Statuses.ACCEPTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha110", applicationId: "a11", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-20T12:00:00Z", changedById: null },
    { id: "ha120", applicationId: "a12", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-21T12:00:00Z", changedById: null },
    { id: "ha130", applicationId: "a13", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-16T12:00:00Z", changedById: null },
    { id: "ha131", applicationId: "a13", fromStatus: Statuses.APPLIED, toStatus: Statuses.SHORTLISTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha140", applicationId: "a14", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-17T12:00:00Z", changedById: null },
    { id: "ha141", applicationId: "a14", fromStatus: Statuses.APPLIED, toStatus: Statuses.REJECTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha150", applicationId: "a15", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-18T12:00:00Z", changedById: null },
    { id: "ha151", applicationId: "a15", fromStatus: Statuses.APPLIED, toStatus: Statuses.ACCEPTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha160", applicationId: "a16", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-16T12:00:00Z", changedById: null },
    { id: "ha161", applicationId: "a16", fromStatus: Statuses.APPLIED, toStatus: Statuses.REJECTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha170", applicationId: "a17", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-17T12:00:00Z", changedById: null },
    { id: "ha171", applicationId: "a17", fromStatus: Statuses.APPLIED, toStatus: Statuses.ACCEPTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha180", applicationId: "a18", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-18T12:00:00Z", changedById: null },
    { id: "ha190", applicationId: "a19", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-16T12:00:00Z", changedById: null },
    { id: "ha191", applicationId: "a19", fromStatus: Statuses.APPLIED, toStatus: Statuses.ACCEPTED, createdAt: "2026-09-19T12:00:00Z", changedById: "u-company" },
    { id: "ha200", applicationId: "a20", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-17T12:00:00Z", changedById: null },
    { id: "ha210", applicationId: "a21", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-18T12:00:00Z", changedById: null },
    { id: "hm0", applicationId: "a-me1", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-20T12:00:00Z", changedById: null },
    { id: "hm1", applicationId: "a-me1", fromStatus: Statuses.APPLIED, toStatus: Statuses.REVIEWING, createdAt: "2026-09-21T12:00:00Z", changedById: "c-domo" },
    { id: "hm2", applicationId: "a-me2", fromStatus: null, toStatus: Statuses.APPLIED, createdAt: "2026-09-21T12:00:00Z", changedById: null },
];

async function main() {
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    for (const user of users) {
        await prisma.users.upsert({
            where: { id: user.id },
            update: { name: user.name, email: user.email, role: user.role },
            create: { ...user, password: hashedPassword },
        });
    }

    for (const job of jobs) {
        const jobFields = {
            title: job.title,
            location: job.location,
            salary_min: job.salaryMin,
            salary_max: job.salaryMax,
            job_type: job.jobType,
            description: jobDescription(job.title),
            requirements: jobRequirements,
        };
        await prisma.jobs.upsert({
            where: { id: job.id },
            update: {
                ...jobFields,
                user: { connect: { id: job.companyId } },
            },
            create: {
                id: job.id,
                ...jobFields,
                createdAt: new Date(job.createdAt),
                user: { connect: { id: job.companyId } },
            },
        });
    }

    for (const application of applications) {
        const applicationFields = {
            status: application.status,
            cover_letter: application.coverLetter,
            jobs_id: application.jobId,
            user_id: application.candidateId,
        };
        await prisma.applications.upsert({
            where: { id: application.id },
            update: applicationFields,
            create: {
                id: application.id,
                ...applicationFields,
                createdAt: new Date(application.createdAt),
                updatedAt: new Date(application.updatedAt),
            },
        });
    }

    for (const history of histories) {
        // Entri histori pertama tiap lamaran (fromStatus null) dianggap aksi kandidat sendiri saat melamar.
        const application = applications.find((a) => a.id === history.applicationId)!;
        const changedById = history.changedById ?? application.candidateId;
        const historyFields = {
            from_status: history.fromStatus,
            to_status: history.toStatus,
            application_id: history.applicationId,
            user_id: changedById,
        };

        await prisma.histories.upsert({
            where: { id: history.id },
            update: historyFields,
            create: {
                id: history.id,
                ...historyFields,
                createdAt: new Date(history.createdAt),
            },
        });
    }

    console.log(`Seed selesai: ${users.length} users, ${jobs.length} jobs, ${applications.length} applications, ${histories.length} histories.`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => process.exit());
