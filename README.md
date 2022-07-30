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

## database

inspect

```bash
yarn prisma studio
#or
pscale shell botgame dev
```

sync database with prisma schema (run after changing prisma/schema.prisma)

```bash
yarn prisma db push
```

## scripts

```bash
yarn tsnode ./scripts/create_dummydata.ts
```

## TODO

- [ ] create profiles
- [ ] game lobby / play game functionality

## References

[create-t3-app](https://github.com/t3-oss/create-t3-app)

[setup-next-js-with-prisma-and-planetscale](https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale)
