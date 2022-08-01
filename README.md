# botgame

## develop

install

```bash
yarn install
```

create a local proxy to database on planetscale and start

```bash
pscale connect botgame dev --port 3309
```

start

```bash
yarn dev
```

## dev-database

inspect

```bash
yarn prisma studio
#or
pscale shell botgame dev
```

After changes to prisma/schema.prisma

```bash
yarn prisma generate #"sync typescript" with prisma schema
yarn prisma db push #"sync database" with prisma schema
```

## prod-database

on planetscale: make deploy request from dev to main and accept it.
If there are conflics, like new required fields on tables that already have records, then... create a completely new db?

## scripts

```bash
yarn tsnode ./scripts/create_dummydata.ts
```

## TODO

- [ ] create bots
- [ ] game lobby / play game functionality

## References

[create-t3-app](https://github.com/t3-oss/create-t3-app)

[setup-next-js-with-prisma-and-planetscale](https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale)
