import { CityModule } from 'src/city/city.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryService } from './country.service';
import { Module, forwardRef } from '@nestjs/common';
import { CountryController } from './country.controller';
import { Country, CountrySchema } from './entities/country.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Country.name,
        schema: CountrySchema,
      },
    ]),
    forwardRef(() => CityModule),
  ],
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}
