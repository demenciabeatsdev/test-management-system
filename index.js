const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const keywordRoutes = require('./routes/keywordRoutes');
const testCaseRoutes = require('./routes/testCaseRoutes');
const testCaseStepsRoutes = require('./routes/testCaseStepsRoutes');
const testPlanRoutes = require('./routes/testPlanRoutes');
const testSuiteRoutes = require('./routes/testSuiteRoutes');
const executionCyclesRoutes = require('./routes/executionCyclesRoutes');
const requirementRoutes = require('./routes/requirementRoutes'); // Rutas de Requerimientos
const buildRoutes = require('./routes/buildRoutes'); // Rutas de Builds

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); 
app.use('/api/keywords', keywordRoutes);
app.use('/api/test-case-steps', testCaseStepsRoutes);
app.use('/api/test-plans', testPlanRoutes);
app.use('/api/test-suites', testSuiteRoutes);
app.use('/api/test-cases', testCaseRoutes);
app.use('/api/execution-cycles', executionCyclesRoutes);
app.use('/api/requirements', requirementRoutes); // Registrar rutas de Requerimientos
app.use('/api/builds', buildRoutes); // Registrar rutas de Builds

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
