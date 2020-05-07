import * as Knex from "knex";
import bcrypt from 'bcryptjs';
import { PlayerData } from "project/DAYZ/types";

export async function seed(knex: Knex): Promise<any> {
    const hash1 = await bcrypt.hash('test11', 10);
    const hash2 = await bcrypt.hash('test22', 10);

    return knex("players").del()
        .then(() => {
            return knex<PlayerData>("players").insert([
                { login: 'test11', passwordHash: hash1, email: 'test1@ya.ru' },
                { login: 'test22', passwordHash: hash2, email: 'test1@ya.ru' },
            ]);
        });
};