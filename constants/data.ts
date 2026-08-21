export type PlantKey = "rosella" | "sambung_nyawa" | "binahong" | "ubi";

export type PlantCapacity = {
  rosella: number;
  sambung_nyawa: number;
  binahong: number;
  ubi: number;
};

export const PLANT_LABELS: Record<PlantKey, string> = {
  rosella: "Rosella",
  sambung_nyawa: "Sambung Nyawa",
  binahong: "Binahong",
  ubi: "Ubi Jalar Kuning",
};

/**
 * Kapasitas tanaman yang BENAR-BENAR ditanam di setiap RW.
 * Nilai 0 berarti tanaman tersebut memang tidak ditanam di RW tersebut
 * sehingga tidak ditampilkan pada form monitoring.
 */
export const PLANT_CAPACITY: Record<string, PlantCapacity> = {
  "RW 01": {
    rosella: 20,
    sambung_nyawa: 15,
    binahong: 20,
    ubi: 50,
  },
  "RW 02": {
    rosella: 8,
    sambung_nyawa: 8,
    binahong: 10,
    ubi: 10,
  },
  "RW 03": {
    rosella: 10,
    sambung_nyawa: 10,
    binahong: 10,
    ubi: 20,
  },
  "RW 04": {
    rosella: 5,
    sambung_nyawa: 5,
    binahong: 5,
    ubi: 0,
  },
  "RW 05": {
    rosella: 10,
    sambung_nyawa: 10,
    binahong: 10,
    ubi: 25,
  },
  "RW 06": {
    rosella: 10,
    sambung_nyawa: 5,
    binahong: 10,
    ubi: 10,
  },
};

export const RW_LIST = Object.keys(PLANT_CAPACITY);

export const getRwCapacity = (rw: string) => {
  const data = PLANT_CAPACITY[rw];
  if (!data) return 0;
  return Object.values(data).reduce((sum, value) => sum + value, 0);
};
