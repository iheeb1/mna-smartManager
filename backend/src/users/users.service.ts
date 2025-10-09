import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, GetUsersDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(userId: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { userId } });
  }

  async findByUsername(userName: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { userName } });
  }

  async findByUsernameAndPassword(
    userName: string,
    password: string,
  ): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.userName = :userName', { userName })
      .andWhere('user.password = :password', { password })
      .getOne();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async update(userId: number, updateUserDto: CreateUserDto): Promise<User | null> {
    await this.usersRepository.update(userId, updateUserDto);
    return this.findById(userId);
  }

  async save(user: CreateUserDto): Promise<User | null> {
    if (user.userId && user.userId > 0) {
      return this.update(user.userId, user);
    } else {
      return this.create(user);
    }
  }

  async findAll(params: GetUsersDto): Promise<[User[], number]> {
    const {
      userId = -1,
      userStatus = -1,
      userType = -1,
      fullName = '',
      userName = '',
      phoneNumber = '',
      mobileNumber = '',
      faxNumber = '',
      city = '',
      createdBy = -1,
      modifiedBy = -1,
      fromCreatedDate = '',
      toCreatedDate = '',
      fromModifiedDate = '',
      toModifiedDate = '',
      itemsPerPage = 30,
      pageNumber = 0,
    } = params;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (userId !== -1) {
      queryBuilder.andWhere('user.userId = :userId', { userId });
    }

    if (userStatus !== -1) {
      queryBuilder.andWhere('user.userStatus = :userStatus', { userStatus });
    }

    if (userType !== -1) {
      queryBuilder.andWhere('user.userType = :userType', { userType });
    }

    if (fullName) {
      queryBuilder.andWhere('user.fullName LIKE :fullName', {
        fullName: `%${fullName}%`,
      });
    }

    if (userName) {
      queryBuilder.andWhere('user.userName LIKE :userName', {
        userName: `%${userName}%`,
      });
    }

    if (phoneNumber) {
      queryBuilder.andWhere('user.phoneNumber LIKE :phoneNumber', {
        phoneNumber: `%${phoneNumber}%`,
      });
    }

    if (mobileNumber) {
      queryBuilder.andWhere('user.mobileNumber LIKE :mobileNumber', {
        mobileNumber: `%${mobileNumber}%`,
      });
    }

    if (faxNumber) {
      queryBuilder.andWhere('user.faxNumber LIKE :faxNumber', {
        faxNumber: `%${faxNumber}%`,
      });
    }

    if (city) {
      queryBuilder.andWhere('user.city LIKE :city', { city: `%${city}%` });
    }

    if (createdBy !== -1) {
      queryBuilder.andWhere('user.createdBy = :createdBy', { createdBy });
    }

    if (modifiedBy !== -1) {
      queryBuilder.andWhere('user.modifiedBy = :modifiedBy', { modifiedBy });
    }

    if (fromCreatedDate && toCreatedDate) {
      queryBuilder.andWhere('user.createdDate BETWEEN :fromCreatedDate AND :toCreatedDate', {
        fromCreatedDate: `${fromCreatedDate} 00:00:00`,
        toCreatedDate: `${toCreatedDate} 23:59:59`,
      });
    }

    if (fromModifiedDate && toModifiedDate) {
      queryBuilder.andWhere('user.modifiedDate BETWEEN :fromModifiedDate AND :toModifiedDate', {
        fromModifiedDate: `${fromModifiedDate} 00:00:00`,
        toModifiedDate: `${toModifiedDate} 23:59:59`,
      });
    }

    queryBuilder
      .skip(pageNumber * itemsPerPage)
      .take(itemsPerPage);

    return queryBuilder.getManyAndCount();
  }

  async remove(userId: number): Promise<void> {
    await this.usersRepository.delete(userId);
  }
}