import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { IsEmail, IsNotEmpty, Length } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Fork } from "../entity/Fork";

@Entity()
@Unique(["username"])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 30)
    @IsNotEmpty({ message: 'The username is required' })
    username: string;

    @Column()
    @Length(6, 30, { message: 'The password must be at least 6 but not longer than 30 characters' })
    @IsNotEmpty({ message: 'The password is required' })
    password: string;

    @Column()
    @IsEmail({}, { message: 'Incorrect email' })
    @IsNotEmpty({ message: 'The email is required' })
    email: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(type => Fork, fork => fork.user)
    forks: Fork[];

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}