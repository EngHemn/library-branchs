"use client"

import { NotificationsFakeDataSource } from "@/data/datasources/NotificationsFakeDataSource"
import { NotificationsRepositoryImpl } from "@/data/repositories/NotificationsRepositoryImpl"
import { NotificationsUseCase } from "@/domain/usecases/notifications/NotificationsUseCase"
import { NotificationsScreen } from "@/presentation/screens/notifications/NotificationsScreen"

const notificationsFakeDataSource = new NotificationsFakeDataSource()
const notificationsRepository = new NotificationsRepositoryImpl(notificationsFakeDataSource)
const notificationsUseCase = new NotificationsUseCase(notificationsRepository)

export default function NotificationsPage() {
  return <NotificationsScreen notificationsUseCase={notificationsUseCase} />
}
