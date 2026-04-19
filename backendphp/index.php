<?php
// Habilitar a exibição de erros para depuração (remover em produção)
ini_set('display_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'controllers/MedicoController.php';

try {
    $controller = new MedicoController();
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    // Tenta extrair o ID do final da URL (ex: /api/v1/medicos/123)
    $uriParts = explode('/', rtrim($uri, '/'));
    $extractedId = end($uriParts);
    $id = is_numeric($extractedId) ? (int)$extractedId : 0;

    if (strpos($uri, '/api/v1/medicos') !== false) {
        if ($method === 'GET') {
            $controller->getAll();
        } elseif ($method === 'POST') {
            $data = json_decode(file_get_contents("php://input"));
            
            // Validação básica dos dados recebidos
            if (empty($data) || empty($data->nome) || empty($data->CRM) || empty($data->UFCRM)) {
                http_response_code(400); // Bad Request
                echo json_encode(["message" => "Erro ao criar médico: dados incompletos ou em formato inválido."], JSON_UNESCAPED_UNICODE);
                exit();
            }

            $controller->create($data);
        } elseif ($method === 'PUT') {
            $data = json_decode(file_get_contents("php://input"));

            // Validação básica dos dados recebidos
            if ($id <= 0 || empty($data) || empty($data->nome) || empty($data->CRM) || empty($data->UFCRM)) {
                http_response_code(400); // Bad Request
                echo json_encode(["message" => "Erro ao atualizar médico: ID inválido ou dados incompletos."], JSON_UNESCAPED_UNICODE);
                exit();
            }

            $controller->update($id, $data);
        } elseif ($method === 'DELETE') {
            if ($id <= 0) {
                http_response_code(400); // Bad Request
                echo json_encode(["message" => "Erro ao deletar médico: ID inválido."], JSON_UNESCAPED_UNICODE);
                exit();
            }

            $controller->delete($id);    
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Método não permitido."], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Rota não encontrada."], JSON_UNESCAPED_UNICODE);
    }
} catch (Throwable $e) { // Captura Exceptions e Errors (PHP 7+)
    http_response_code(500); // Internal Server Error
    // Retorna uma mensagem de erro JSON estruturada para depuração
    echo json_encode([
        "message" => "Ocorreu um erro interno no servidor.",
        "error" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ], JSON_UNESCAPED_UNICODE);
}
?>