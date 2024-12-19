import { NextResponse } from 'next/server';

const locations = [
  {
    "_id": "6758616e051ce10cc5f78df6",
    "name": "Ericeira",
    "enabled": false,
    "spots": [
      {
        "name": "Coxos",
        "id": "5842041f4e65fad6a7708bc4",
        "active": true
      },
      {
        "name": "Praia do Sul",
        "id": "5fb2c2da7057d993d9d2caa3",
        "active": true
      },
      {
        "name": "São Lourenço",
        "id": "5842041f4e65fad6a7708bcb",
        "active": false
      },
      {
        "name": "Reef",
        "id": "5842041f4e65fad6a7708bc1",
        "active": false
      },
      {
        "name": "Foz de Lizandro",
        "id": "5842041f4e65fad6a7708bbd",
        "active": false
      },
      {
        "name": "Pedra Branca",
        "id": "584204204e65fad6a77096ae",
        "active": false
      },
      {
        "name": "Cave",
        "id": "5d702a08b8be350001890108",
        "active": false
      },
      {
        "name": "Ribeira D'Ilhas",
        "id": "5842041f4e65fad6a7708bc2",
        "active": false
      }
    ]
  },
  {
    "_id": "6758658d051ce10cc5f78ff7",
    "name": "Lisbon",
    "spots": [
      {
        "name": "São Pedro do Estoril",
        "id": "640b9d679b6fab7dac307b39",
        "active": true
      },
      {
        "name": "Parede",
        "id": "640b9d6db6d769d0c8951b5b",
        "active": false
      },
      {
        "name": "Carcavelos",
        "id": "5842041f4e65fad6a7708bc0",
        "active": false
      },
      {
        "name": "Praia de Torre",
        "id": "602d64e1d663ff28d7a951c2",
        "active": false
      },
      {
        "name": "Santo Amaro",
        "id": "584204214e65fad6a7709d13",
        "active": false
      },
      {
        "name": "Praia da Laje",
        "id": "640b9d10de81d566960e2892",
        "active": false
      },
      {
        "name": "Paço de Arcos",
        "id": "584204214e65fad6a7709d0c",
        "active": false
      }
    ]
  }
];

export async function GET() {
  return NextResponse.json(locations);
}