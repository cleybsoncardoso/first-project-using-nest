import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CarService } from './car.service';
import { CreateCarDTO } from './dto/CreateCar.dto';
import { Car } from './entity/Car.entity';

@ApiTags('Car')
@ApiBearerAuth('jwt')
@Controller('car')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  @ApiOkResponse({ type: Car, isArray: true })
  async index(): Promise<Car[]> {
    return await this.carService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Car })
  async show(@Param('id') id: number): Promise<Car> {
    return await this.carService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateCarDTO })
  @ApiOkResponse({ type: Car })
  async store(@Body() carDTO: CreateCarDTO) {
    return this.carService.create(carDTO);
  }
}
