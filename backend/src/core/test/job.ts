import {addMonths} from 'date-fns';
import {ObjectId} from 'mongodb';
import {JobDocument} from '../data/collection/jobCollection';

export function jobDocument(data?: Partial<JobDocument>): JobDocument {
  return {
    _id: new ObjectId(),
    title: 'Uklízečka',
    scope: 'půl roku',
    text: 'hledáme šikovnou uklízečku seniorku budov kampusu',
    requirements: 'měla byste umět uklízet',
    benefits: 'dostanete cestovní koště',
    salary: '100 Kč / hod',
    place: 'Celá Česká republika',
    specificPlace: 'kdekoli',
    startDate: 'co nejdříve',
    deadlineAt: addMonths(new Date(), 1),
    createdAt: new Date(),
    updatedAt: new Date(),
    approved: true,
    archived: false,
    other: 'jíné',
    fieldTypes: ['Administrativa'],
    legalType: ['Dohoda o provedení práce'],
    durationType: ['Krátkodobá'],
    employmentType: ['Plný úvazek'],
    homeoffice: true,
    advertiser: {
      _id: new ObjectId(),
      name: 'Uklízečky s.r.o.',
      logo: 'https://www.google.com/images/image.jpg',
      about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      web: 'https://www.google.com',
    },
    ...data,
  };
}
