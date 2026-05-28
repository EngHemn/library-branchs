import { ReportsFakeDataSource } from "@/data/datasources/ReportsFakeDataSource"
import { ReportsRepositoryImpl } from "@/data/repositories/ReportsRepositoryImpl"
import { GetReportsUseCase } from "@/domain/usecases/reports/GetReportsUseCase"

const reportsFakeDataSource = new ReportsFakeDataSource()
const reportsRepository = new ReportsRepositoryImpl(reportsFakeDataSource)

export const getReportsUseCase = new GetReportsUseCase(reportsRepository)
