import React from "react";

interface CountrySelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  required?: boolean;
  className?: string;
  theme?: "dark" | "light";
}

const MIDDLE_EAST_COUNTRIES = [
  "United Arab Emirates",
  "Saudi Arabia",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Oman",
  "Jordan",
  "Lebanon",
  "Egypt",
  "Iraq",
  "Syria",
  "Yemen",
  "Palestine",
  "Israel",
  "Turkey",
  "Iran",
  "Cyprus",
];

export default function CountrySelect({
  value,
  onChange,
  name,
  required = false,
  className,
  theme = "dark",
}: CountrySelectProps) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={
        className ||
        `w-full px-4 py-3 rounded-lg border transition-all outline-none ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        } focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent`
      }
    >
      <option value="">Select Country</option>
      {MIDDLE_EAST_COUNTRIES.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
}

export { MIDDLE_EAST_COUNTRIES };
