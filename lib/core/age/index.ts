/**
 * lib/core/age/index.ts
 *
 * Deterministic Age Calculator for Vayam.
 * Pure mathematical age calculation handling leap years, month boundaries, exact birthdays,
 * and next birthday countdowns. Zero AI dependencies.
 */

import type { DetailedAge } from "../types";

/**
 * Calculates complete age breakdown in years, months, days, and countdown to next birthday.
 *
 * @param dateOfBirth - ISO date string "YYYY-MM-DD"
 * @param referenceDate - Reference date (defaults to current date)
 */
export function calculateAgeDetailed(
  dateOfBirth: string,
  referenceDate: Date = new Date()
): DetailedAge {
  const [dobYear, dobMonth, dobDay] = dateOfBirth.split("-").map(Number);
  const dob = new Date(Date.UTC(dobYear, dobMonth - 1, dobDay));

  const refYear = referenceDate.getUTCFullYear();
  const refMonth = referenceDate.getUTCMonth() + 1;
  const refDay = referenceDate.getUTCDate();
  const refDateUtc = new Date(Date.UTC(refYear, refMonth - 1, refDay));

  // 1. Check if birthday has occurred in reference year
  const hasHadBirthdayThisYear =
    refMonth > dobMonth || (refMonth === dobMonth && refDay >= dobDay);

  // 2. Years calculation
  let years = refYear - dobYear;
  if (!hasHadBirthdayThisYear) {
    years -= 1;
  }

  // Handle future birth dates safely
  if (years < 0) {
    years = 0;
  }

  // 3. Months & Days calculation
  let months = refMonth - dobMonth;
  if (refDay < dobDay) {
    months -= 1;
  }
  if (months < 0) {
    months += 12;
  }

  let days = refDay - dobDay;
  if (days < 0) {
    // Get days in previous month
    const prevMonthDate = new Date(Date.UTC(refYear, refMonth - 1, 0));
    days += prevMonthDate.getUTCDate();
  }

  // 4. Next birthday date calculation
  let nextBirthdayYear = refYear;
  if (hasHadBirthdayThisYear && !(refMonth === dobMonth && refDay === dobDay)) {
    nextBirthdayYear += 1;
  }

  // Handle Feb 29 leap year birthday for non-leap target years
  let nextBirthdayMonth = dobMonth;
  let nextBirthdayDay = dobDay;
  if (dobMonth === 2 && dobDay === 29) {
    const isLeapTarget =
      (nextBirthdayYear % 4 === 0 && nextBirthdayYear % 100 !== 0) ||
      nextBirthdayYear % 400 === 0;
    if (!isLeapTarget) {
      nextBirthdayDay = 28;
    }
  }

  const nextBirthdayIso = `${nextBirthdayYear}-${String(nextBirthdayMonth).padStart(2, "0")}-${String(nextBirthdayDay).padStart(2, "0")}`;
  const nextBirthdayDate = new Date(Date.UTC(nextBirthdayYear, nextBirthdayMonth - 1, nextBirthdayDay));

  // 5. Days until next birthday
  const msPerDay = 1000 * 60 * 60 * 24;
  let daysUntilBirthday = 0;

  if (refMonth === dobMonth && refDay === dobDay) {
    daysUntilBirthday = 0;
  } else {
    const diffMs = nextBirthdayDate.getTime() - refDateUtc.getTime();
    daysUntilBirthday = Math.max(0, Math.ceil(diffMs / msPerDay));
  }

  return {
    years,
    months,
    days,
    nextBirthday: nextBirthdayIso,
    daysUntilBirthday,
    hasHadBirthdayThisYear,
  };
}

/**
 * Utility helper returning completed years.
 */
export function getAgeInYears(dateOfBirth: string, referenceDate: Date = new Date()): number {
  return calculateAgeDetailed(dateOfBirth, referenceDate).years;
}
