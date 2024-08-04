import { randomUUID } from 'node:crypto'

import bcrypt from 'bcrypt'

export const createUuid = randomUUID

const saltrounds = 10

export const hashPassword = (password: string) => bcrypt.hash(password, saltrounds)
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash)
