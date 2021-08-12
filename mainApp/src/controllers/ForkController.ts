import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Events } from "../util/types/events.enum";
import EventEmitter from "../util/eventEmitter";
import { Fork } from "../entity/Fork";

class ForkController {

    static listAll = async (req: Request, res: Response) => {
        const query = createQueryBuilder('fork', 'f')
            .innerJoin('f.user', 'u')
            .innerJoin('f.category', 'c')
            .select(['f', 'u.email', 'u.username', 'c']);
        const forks = await query.getMany();

        res.send(forks);
    };

    static newFork = async (req: Request, res: Response) => {
        let { name, description, year, categoryId } = req.body;
        let fork = new Fork();
        fork.name = name;
        fork.description = description;
        fork.year = year;
        fork.user = { id: req.userId };
        fork.category = { id: categoryId };

        const errors = await validate(fork);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        const forkRepository = getRepository(Fork);
        try {
            await forkRepository.save(fork);
        } catch (e) {
            res.status(409).send("such fork name already exists");
            return;
        }

        EventEmitter.emit(Events.ForkCreated, fork);

        res.status(201).send("Fork created");
    }
};

export default ForkController;