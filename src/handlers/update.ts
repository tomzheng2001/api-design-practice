import prisma from "../db";

// get all
export const getUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((accumulator, product) => {
    return [...accumulator, ...product.updates];
  }, []);

  res.json({ data: updates });
};

// get one
export const getOneUpdate = async (req, res) => {
  const id = req.params.id;

  const update = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: update });
};

// create
export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });

  if (!product) {
    res.json({ message: "nope" });
  }

  const update = await prisma.update.create({
    data: req.body,
  });

  res.json({ data: update });
};

//update
export const updateUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((accumulator, product) => {
    return [...accumulator, ...product.updates];
  }, []);

  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    return res.json({ message: "nope" });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

//delete
export const deleteUpdate = async (req, res) => {
  const match = await prisma.update.findFirst({
    where: {
      id: req.params.id,
      product: {
        belongsToId: req.user.id,
      },
    },
  });

  if (!match) {
    return res.json({ message: "nope" });
  }

  const deleteUpdate = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json({ data: deleteUpdate });
};
