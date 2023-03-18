import { Module } from '@nestjs/common';
import { CityModule } from './city/city.module';
import { RoleModule } from './role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CountryModule } from './country/country.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { DniTypeModule } from './dni_type/dni_type.module';
import { CategoryModule } from './category/category.module';

const MONGO_DB_URI = `mongodb+srv://larosoft:d2DTZoc5EhPH2pwF@larogroupcluster.zo0y98k.mongodb.net/larogroup?retryWrites=true&w=majority`;

@Module({
  imports: [
    CountryModule,
    MongooseModule.forRoot(MONGO_DB_URI),
    CityModule,
    SuperadminModule,
    RoleModule,
    DniTypeModule,
    CategoryModule,
  ],
})
export class AppModule {}
