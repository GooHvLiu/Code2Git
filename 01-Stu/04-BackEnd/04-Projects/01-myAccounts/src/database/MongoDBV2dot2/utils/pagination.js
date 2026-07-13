/**
 * mongo分页封装
 * @param {Model} model mongoose模型
 * @param {Object} query 查询条件
 * @param {Object} options {page, limit, sort, select}
 * @returns {Object} {list, total, page, limit, pages}
 */
const pagination = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    select = "",
  } = options;
  const skip = (Number(page) - 1) * Number(limit);

  // 并行查询总数+列表，性能更优
  const [list, total] = await Promise.all([
    model.find(query).select(select).sort(sort).skip(skip).limit(Number(limit)),
    model.countDocuments(query),
  ]);

  return {
    list,
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / limit),
  };
};

module.exports = pagination;
