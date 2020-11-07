import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateAdapter extends NgxMatDateAdapter<Date> {
    getHour(date: Date): number {
        throw new Error('Method not implemented.');
    }
    getMinute(date: Date): number {
        throw new Error('Method not implemented.');
    }
    getSecond(date: Date): number {
        throw new Error('Method not implemented.');
    }
    setHour(date: Date, value: number): void {
        throw new Error('Method not implemented.');
    }
    setMinute(date: Date, value: number): void {
        throw new Error('Method not implemented.');
    }
    setSecond(date: Date, value: number): void {
        throw new Error('Method not implemented.');
    }
    getYear(date: Date): number {
        throw new Error('Method not implemented.');
    }
    getMonth(date: Date): number {
        throw new Error('Method not implemented.');
    }
    getDate(date: Date): number {
        throw new Error('Method not implemented.');
    }
    getDayOfWeek(date: Date): number {
        throw new Error('Method not implemented.');
    }
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
        throw new Error('Method not implemented.');
    }
    getDateNames(): string[] {
        throw new Error('Method not implemented.');
    }
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
        throw new Error('Method not implemented.');
    }
    getYearName(date: Date): string {
        throw new Error('Method not implemented.');
    }
    getFirstDayOfWeek(): number {
        throw new Error('Method not implemented.');
    }
    getNumDaysInMonth(date: Date): number {
        throw new Error('Method not implemented.');
    }
    clone(date: Date): Date {
        throw new Error('Method not implemented.');
    }
    createDate(year: number, month: number, date: number): Date {
        throw new Error('Method not implemented.');
    }
    today(): Date {
        throw new Error('Method not implemented.');
    }
    parse(value: any, parseFormat: any): Date {
        throw new Error('Method not implemented.');
    }
    format(date: Date, displayFormat: any): string {
        throw new Error('Method not implemented.');
    }
    addCalendarYears(date: Date, years: number): Date {
        throw new Error('Method not implemented.');
    }
    addCalendarMonths(date: Date, months: number): Date {
        throw new Error('Method not implemented.');
    }
    addCalendarDays(date: Date, days: number): Date {
        throw new Error('Method not implemented.');
    }
    toIso8601(date: Date): string {
        throw new Error('Method not implemented.');
    }
    isDateInstance(obj: any): boolean {
        throw new Error('Method not implemented.');
    }
    isValid(date: Date): boolean {
        throw new Error('Method not implemented.');
    }
    invalid(): Date {
        throw new Error('Method not implemented.');
    }
}