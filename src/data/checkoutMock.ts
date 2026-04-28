export type Governorate = {
  id: number;
  name: string;
  fee: number;
};

export const governorates: Governorate[] = [
  { id: 1, name: "القاهرة", fee: 70 },
  { id: 2, name: "الجيزة", fee: 75 },
  { id: 3, name: "الإسكندرية", fee: 85 },
  { id: 4, name: "المنصورة", fee: 80 },
  { id: 5, name: "أسيوط", fee: 95 },
];
