import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { IsNotEmpty, Length } from "class-validator";
import { Fork } from "../entity/Fork";

@Entity()
@Unique(["name"])
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 30)
    @IsNotEmpty({ message: 'The name is required' })
    name: string;

    @Column()
    @Length(10, 100, { message: 'The description must be at least 10 but not longer than 100 characters' })
    @IsNotEmpty({ message: 'The description is required' })
    description: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => Fork, fork => fork.category)
    forks: Fork[];
}