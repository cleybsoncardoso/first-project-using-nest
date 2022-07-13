import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Car } from './entity/Car.entity';
import { Repository } from 'typeorm';
import { CreateCarDTO } from './dto/CreateCar.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car) private readonly carRepository: Repository<Car>,
  ) {}

  findAll(): Promise<Car[]> {
    return this.carRepository.find();
  }

  findOne(id: number): Promise<Car> {
    return this.carRepository.findOne({ where: { id } });
  }

  create(todo: CreateCarDTO): Promise<Car> {
    return this.carRepository.save(todo);
  }
}
