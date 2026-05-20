import type { Kit, Review } from './types';

// Products and categories are served by the backend API.
// Only static content (kits, reviews) lives here.

interface PVStaticData {
  kits: Kit[];
  reviews: Review[];
}

export const PV_DATA: PVStaticData = {
  kits: [
    {
      id: "kit-primeiro-gato",
      name: "Kit Primeiro Gato",
      items: ["Fonte Pétala", "Ninho Pão", "Arranhador Onda", "Varinha Pluma"],
      price: 549.0,
      old: 657.8,
      desc: "Tudo o que o gato precisa nos primeiros 30 dias. Embalado em caixa-presente."
    },
    {
      id: "kit-caca-noturna",
      name: "Kit Caça Noturna",
      items: ["Ratinho elétrico", "Túnel Veludo", "Bola Pena ×6"],
      price: 219.0,
      old: 234.7,
      desc: "Para o gato que acorda a casa às 3:47. Cansa antes da meia-noite."
    },
    {
      id: "kit-rotina-zen",
      name: "Kit Rotina Zen",
      items: ["Fonte Pétala", "Puzzle Camarão", "Catnip artesanal"],
      price: 389.0,
      old: 443.8,
      desc: "Hidratação contínua, alimentação desacelerada, mente ocupada."
    }
  ],
  reviews: [
    { who: "Marina e o Quindim", city: "São Paulo", text: "A fonte chegou em uma caixa rosa com um bilhete escrito à mão. O Quindim deitou em cima da caixa antes de testar a fonte. Aprovado por ele e por mim.", rating: 5 },
    { who: "Beto e a Mafalda", city: "Curitiba", text: "Comprei o Kit Caça Noturna achando que era enrolação. Dormi a noite toda pela primeira vez em meses.", rating: 5 },
    { who: "Lia, Tofu e Pipoca", city: "Recife", text: "Dois gatos brigando pelo mesmo ninho. Tive que comprar o segundo. Vocês são culpadas.", rating: 5 }
  ]
};
