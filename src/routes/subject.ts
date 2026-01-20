import { and, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import express from "express";
import { subjects,departments } from "../db/schema";
import { db } from "../db";

const router = express.Router();

// Get all subjects with optional search,pagination and filtering
router.get("/" , async(req , res) => {
    try{

      const {search , department , page = 1 , limit = 10} = req.query;
      const currentPage = Math.max(Number(page) , 1);
      const limitPerPage = Math.max(Number(limit) , 1);
      const offset = (currentPage - 1) * limitPerPage;
      const filterConditions = [];

      if(search){
        filterConditions.push(or(ilike(subjects.name , `%${search}%`) , ilike(subjects.code , `%${search}%`)));
      }

      if(department){
        filterConditions.push(or(ilike(departments.name , `%${department}%`) , ilike(departments.code , `%${department}%`)));
      }

      const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;
      const countResult = await db.select({count: sql<number>`count(*)`}).from(subjects).leftJoin(departments, eq(subjects.departmentId , departments.id)).where(whereClause);

      const totalCount = countResult[0]?.count || 0;

      const subjectsResult = await db.select({
        ...getTableColumns(subjects),
        departmentName: {...getTableColumns(departments)},
      }).from(subjects).leftJoin(departments, eq(subjects.departmentId , departments.id))
      .where(whereClause).limit(limitPerPage).offset(offset);

      res.status(200).json({
        data: subjectsResult,
        pagination: {
          page: currentPage,
          totalItems: totalCount,
          limit: limitPerPage,
          totalPages: Math.ceil(totalCount / limitPerPage),
        }
      });

    }catch(e){
      console.error(`GET /subjects error: ${e}`);
      res.status(500).json({message: "Failed to get subjects"});
    }
})

export default router