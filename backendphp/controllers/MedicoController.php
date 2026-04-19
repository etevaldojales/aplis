<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// ... resto do seu código

require_once 'config/Database.php';
require_once 'models/Medico.php';

class MedicoController {
    private $db;
    private $medico;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->medico = new Medico($this->db);
    }

    public function getAll() {
        $stmt = $this->db->query("SELECT id, nome, CRM, UFCRM FROM medicos WHERE deleted_at IS NULL");
        $num = $stmt->rowCount();
        $medicos_arr = array();

        if($num > 0) {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                extract($row);
                $medico_item = array(
                    "id" => (int)$id,
                    "nome" => $nome,
                    "CRM" => $CRM,
                    "UFCRM" => $UFCRM
                );
                array_push($medicos_arr, $medico_item);
            }
        }
        http_response_code(200);
        echo json_encode($medicos_arr, JSON_UNESCAPED_UNICODE);
    }

    public function create($data) {
        $this->medico->nome = $data->nome;
        $this->medico->CRM = $data->CRM;
        $this->medico->UFCRM = $data->UFCRM;

        if($this->medico->create()) {
            http_response_code(201);
            echo json_encode(["message" => "Médico criado com sucesso"], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Não foi possível criar o médico."], JSON_UNESCAPED_UNICODE);
        }
    }

    public function update($id, $data) {
        $this->medico->id = $id;
        $this->medico->nome = $data->nome;
        $this->medico->CRM = $data->CRM;
        $this->medico->UFCRM = $data->UFCRM;

        if($this->medico->update()) {
            http_response_code(200);
            echo json_encode(["message" => "Médico atualizado com sucesso"], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Não foi possível atualizar o médico."], JSON_UNESCAPED_UNICODE);
        }
    }

    public function delete($id) {
        $this->medico->id = $id;

        if($this->medico->delete()) {
            http_response_code(200);
            echo json_encode(["message" => "Médico deletado com sucesso"], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Não foi possível deletar o médico."], JSON_UNESCAPED_UNICODE);
        }
    }
}
?>