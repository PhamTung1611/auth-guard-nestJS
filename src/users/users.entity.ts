import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

enum Role{
    ADMIN = "ADMIN",
    USER = "USER"
}

@Entity()
export class Users{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email:string;

    @Column()
    @Exclude()
    password:string;

    @Column({
        default:Role.USER
    })
    @Exclude()
    role:Role;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    create_at: Date;

}