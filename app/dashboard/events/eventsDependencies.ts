import { EventFakeDataSource } from "@/data/datasources/EventFakeDataSource"
import { EventRepositoryImpl } from "@/data/repositories/EventRepositoryImpl"
import { GetEventsUseCase } from "@/domain/usecases/events/GetEventsUseCase"

const eventFakeDataSource = new EventFakeDataSource()
const eventRepository = new EventRepositoryImpl(eventFakeDataSource)

export const getEventsUseCase = new GetEventsUseCase(eventRepository)
