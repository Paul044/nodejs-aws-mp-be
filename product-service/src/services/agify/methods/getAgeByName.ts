import axios from 'axios';
import { GetAgeByNameResponse } from '../models';

const AGIFY_BASE_URL = 'https://api.agify.io';

const getAgeByName = async (name: string): Promise<number> => {
  const { data: person } = await axios.get<GetAgeByNameResponse>(
    `${AGIFY_BASE_URL}?name=${name}`,
  );
  return person.age;
};

export default getAgeByName;
